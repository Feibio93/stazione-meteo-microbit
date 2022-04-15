/*Programma da caricare nella microbit inserita nell'estensione 'WiFi:bit', per il caricamento dei dati della stazione sulla piattaforma ThingSpeak

Prima di iniziare, aggiungere le librerie "WiFi:bit" e "IoT environment kit"*/


enum RadioMessage {
    Thingspeak = 55204
}
input.onButtonPressed(Button.A, function () {  //Usa il bottone A per verificare la corretta ricezione dei dati
    basic.showNumber(Temperatura_aria)
    basic.pause(500)
    basic.showNumber(Umidita_aria)
    basic.pause(500)
    basic.showNumber(Velocita_vento)
    basic.pause(500)
    basic.showNumber(Pressione)
    basic.pause(500)
    basic.showNumber(Pioggia_caduta)
    basic.clearScreen()
})
radio.onReceivedValue(function (name, value) {  //Salva i valori ricevuti dalla microbit sulla stazione meteo (programma 'weatherbit.js')
    if (name == "HTTS") {
        Umidita_terreno = value
    }
    if (name == "VVTS") {
        Velocita_vento = value
    }
    if (name == "PRTS") {
        Pressione = value
    }
    if (name == "TATS") {
        Temperatura_aria = value
    }
    if (name == "HATS") {
        Umidita_aria = value
    }
    if (name == "PITS") {
        Pioggia_caduta = value
    }
    if (name == "MAXTA") {
        Temperatura_massima = value
    }
    if (name == "MINTA") {
        Temperatura_minima = value
    }
    if (name == "MAXVV") {
        Velocita_vento_max = value
    }
})
let Pioggia_caduta = 0
let Velocita_vento = 0
let Umidita_terreno = 0
let Umidita_aria = 0
let Temperatura_aria = 0
let Pressione = 0
let Contatore = 0
let Temperatura_massima = 0
let Temperatura_minima = 0
let Velocita_vento_max = 0
let Riepilogo = false
ESP8266_IoT.initWIFI(SerialPin.P16, SerialPin.P8, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("WiFi SSID", "WiFi Password")  //Inserire nome e password della rete WiFi 
led.setBrightness(10)
radio.setGroup(93)
radio.setTransmitPower(7)
Pressione = 8888 //I valori 8888 vengono usati come valori di default
Temperatura_aria = 8888
Umidita_aria = 8888
Umidita_terreno = 8888
Velocita_vento = 8888
Pioggia_caduta = 8888
Temperatura_massima = 8888
Temperatura_minima = 8888
Velocita_vento_max = 8888
basic.forever(function () {
    if (ESP8266_IoT.wifiState(true)) {  //Se è connessa alla rete WiFi mostra il 'tick' e va avanti, altrimenti mostra la X e riprova a connettersi
        basic.showIcon(IconNames.Yes)
        radio.sendMessage(RadioMessage.Thingspeak)
        basic.pause(2000)
        while (Temperatura_aria == 8888 || (Velocita_vento == 8888 || (Umidita_aria == 8888 || (Umidita_terreno == 8888 || (Pressione == 8888 || Pioggia_caduta == 8888))))) {
            radio.sendMessage(RadioMessage.Thingspeak)  //Mostra un'animazione di caricamento e invia il messaggio finchè non ha preso tutti i dati dalla stazione meteo
            images.createImage(`
                . . . . .
                . . . . #
                . . . . #
                . . . . #
                . . . . .
                `).scrollImage(1, 200)
            basic.pause(2000)
        }
        if (ESP8266_IoT.thingSpeakState(true)) {  //Verifica se è connesso a ThingSpeak, se lo è mostra il cuore, altrimenti la faccina arrabbiata e riprova a connettersi
            basic.showIcon(IconNames.Heart)
            basic.pause(500)
            basic.clearScreen()
            if (Temperatura_aria != 8888 && Velocita_vento != 8888 && Umidita_aria != 8888 && Umidita_terreno != 8888 && Pressione != 8888) {
                if (Pioggia_caduta > 0 && Pioggia_caduta != 8888) {  //Se piove, invia anche il dato sulla quantità di pioggia caduta
                    if (Contatore == 5) {                    
                        ESP8266_IoT.setData(
                            "Write API Key",  //Inserire l'API per la scrittura dei dati, visibile su "API Key" nel canale ThingSpeak
                            Temperatura_aria,
                            Umidita_aria,
                            Umidita_terreno,
                            Velocita_vento,
                            Pressione,
                            1,
                            Pioggia_caduta
                        )
                    } else {
                        ESP8266_IoT.setData(
                            "Write API Key",  //Inserire l'API per la scrittura dei dati, visibile su "API Key" nel canale ThingSpeak
                            Temperatura_aria,
                            Umidita_aria,
                            Umidita_terreno,
                            Velocita_vento,
                            Pressione,
                            0,
                            Pioggia_caduta
                        )
                    }
                } else {
                    if (Contatore == 5) {   //Ogni 4 ore pubblica i dati sul canale Telegram
                        ESP8266_IoT.setData(
                            "Write API Key",  //Inserire l'API per la scrittura dei dati, visibile su "API Key" nel canale ThingSpeak
                            Temperatura_aria,
                            Umidita_aria,
                            Umidita_terreno,
                            Velocita_vento,
                            Pressione,
                            1
                        )
                    } else {
                        ESP8266_IoT.setData(
                            "Write API Key",  //Inserire l'API per la scrittura dei dati, visibile su "API Key" nel canale ThingSpeak
                            Temperatura_aria,
                            Umidita_aria,
                            Umidita_terreno,
                            Velocita_vento,
                            Pressione,
                            0
                        )
                    }
                }
                Contatore++
                if (Contatore == 6) {
                    Contatore = 0
                }
                basic.showIcon(IconNames.Happy)
                basic.pause(100)
                ESP8266_IoT.uploadData()
                basic.clearScreen()
                Temperatura_aria = 8888 //Ripristina le variabili al valore di default
                Umidita_aria = 8888
                Umidita_terreno = 8888
                Velocita_vento = 8888
                Pressione = 8888
                Pioggia_caduta = 8888
                if (Temperatura_massima != 8888 && Temperatura_minima != 8888 && Velocita_vento_max != 8888 && Riepilogo == true) {
                    Riepilogo = false
                    ESP8266_IoT.setData("Write API Key",Temperatura_massima,Temperatura_minima,Velocita_vento_max)
                    basic.pause(100)
                    ESP8266_IoT.uploadData()
                    Temperatura_massima = 8888
                    Temperatura_minima = 8888
                    Velocita_vento_max = 8888
                } else {
                    Riepilogo = true
                }
                WiFiBit.executeAtCommand("AT+SLEEP=1", 1000)
                basic.pause(3600000)  //Aspetta un'ora prima di caricare nuovi dati
                WiFiBit.executeAtCommand("AT+SLEEP=0", 1000)
                basic.pause(2000)
            } else {
                basic.showIcon(IconNames.Sad)
                basic.pause(2000)
                basic.clearScreen()
            }
        } else {
            basic.showIcon(IconNames.Angry)
            basic.pause(2000)
            basic.clearScreen()
            ESP8266_IoT.connectThingSpeak()
        }
    } else {
        basic.showIcon(IconNames.No)
        basic.pause(2000)
        basic.clearScreen()
        ESP8266_IoT.connectWifi("WiFi SSID", "WiFi Password")  //Inserire nome e password della rete WiFi
    }
})
