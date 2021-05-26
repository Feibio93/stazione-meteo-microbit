//Programma da caricare nella microbit inserita nell'estensione 'WiFi:bit', per il caricamento dei dati della stazione sulla piattaforma ThingSpeak
//Prima di iniziare, aggiungere le estensioni 'WiFi:bit' e 'IoT environment kit'

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
    if (name == "TTTS") {
        Temperatura_terreno = value
    }
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
})
let Pioggia_caduta = 0
let Velocita_vento = 0
let Umidita_terreno = 0
let Umidita_aria = 0
let Temperatura_terreno = 0
let Temperatura_aria = 0
let Pressione = 0
WiFiBit.connectToWiFiBit()
ESP8266_IoT.connectWifi("WiFi SSID", "WiFi Password") //Inserire nome e password della rete WiFi 
led.setBrightness(10)
radio.setGroup(93)
radio.setTransmitPower(7)
Pressione = 8888 //I valori 8888 vengono usati come valori di default
Temperatura_aria = 8888
Temperatura_terreno = 8888
Umidita_aria = 8888
Umidita_terreno = 8888
Velocita_vento = 8888
Pioggia_caduta = 8888
basic.forever(function () {
    if (ESP8266_IoT.wifiState(true)) {  //Se è connessa alla rete WiFi mostra il 'tick' e va avanti, altrimenti mostra la X e prova nuovamente a connettersi
        basic.showIcon(IconNames.Yes)  
        ESP8266_IoT.connectThingSpeak()
        basic.pause(500)
        if (ESP8266_IoT.thingSpeakState(true)) {  //Se si è connessa alla piattaforma ThingSpeak mostra il cuore e va avanti
            basic.showIcon(IconNames.Heart)
            radio.sendMessage(RadioMessage.Thingspeak)
            basic.pause(2000)
            while (Temperatura_terreno == 8888 || (Temperatura_aria == 8888 || (Velocita_vento == 8888 || (Umidita_aria == 8888 || (Umidita_terreno == 8888 || (Pressione == 8888 || Pioggia_caduta == 8888)))))) { 
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
            if (Temperatura_terreno != 8888 && Temperatura_aria != 8888 && Velocita_vento != 8888 && Umidita_aria != 8888 && Umidita_terreno != 8888 && Pressione != 8888) {
                if (Pioggia_caduta > 0 && Pioggia_caduta != 8888) {  //Se piove, invia anche il dato sulla quantità di pioggia caduta
                    ESP8266_IoT.setData(
                    "Write API Key",  //Inserire l'API per la scrittura dei dati, visibile su "API Key" nel canale ThingSpeak
                    Temperatura_terreno,
                    Temperatura_aria,
                    Umidita_aria,
                    Umidita_terreno,
                    Velocita_vento,
                    Pressione,
                    Pioggia_caduta
                    )
                } else {
                    ESP8266_IoT.setData(
                    "Write API Key",  //Inserire l'API per la scrittura dei dati, visibile su "API Key" nel canale ThingSpeak
                    Temperatura_terreno,
                    Temperatura_aria,
                    Umidita_aria,
                    Umidita_terreno,
                    Velocita_vento,
                    Pressione
                    )
                }
                basic.pause(100)
                ESP8266_IoT.uploadData() //carica i dati su ThingSpeak
                if (ESP8266_IoT.tsLastUploadState(true)) { //Se sono stati caricati correttamente, mostra la faccina felice, altrimenti mostra la faccina triste
                    basic.showIcon(IconNames.Happy)
                    basic.pause(2000)
                    basic.clearScreen()  //Ripristina le variabili al valore di default
                    Temperatura_terreno == 8888
                    Temperatura_aria = 8888
                    Umidita_aria = 8888
                    Umidita_terreno = 8888
                    Velocita_vento = 8888
                    Pressione = 8888
                    Pioggia_caduta = 8888
                    ESP8266_IoT.wait(1800000)  //Aspetta mezz'ora prima di caricare nuovi dati           
                } else {
                    basic.showIcon(IconNames.Sad)
                    basic.pause(2000)
                    basic.clearScreen()
                }
            }
        }
    } else {
        basic.showIcon(IconNames.No)
        ESP8266_IoT.connectWifi("WiFi SSID", "WiFi Password") //Inserire nome e password della rete WiFi
        basic.clearScreen()
    }
})
