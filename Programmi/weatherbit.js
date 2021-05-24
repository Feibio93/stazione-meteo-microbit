/*Programma per la micro:bit da inserire nel modulo di SparkFun. Monitora la temperatura dell'aria, l'umidità dell'aria e del terreno, la velocità e la direzione del vento,
e la quantità di pioggia caduta. Ci sono alcuni problemi nella libreria di SparkFun per quanto riguarda il sensore DS18B20 per la misurazione della temperatura del terreno.

Importare le librerie "weatherbit" e "radio broadcast"*/

enum RadioMessage { //Per usare nomi invece di cifre nei messaggi radio
    Vento = 8497,
    Umidita = 13399,
    Pressione = 14277,
    Temperatura = 36566,
    Thingspeak = 55204,
    Pioggia = 58249
}
function Media_velocita_vento (Inizio: number, Fine: number) { //Calcola la media della velocità del vento rilevata, la arrotonda a 2 decimali e salva il valore trovato
    for (let i = Inizio; i < Fine; i++) {
        Vento = Vento + Velocita_vento[i]
    }
    Vento = Arrotonda_2_decimali(Vento / Fine)
    Velocita_vento = []
    Salva_velocita_vento.push(Vento)
    Vento = 0
}
function Media_direzione_vento (Inizio: number, Fine: number) {  //Come sopra, ma per quanto riguarda la direzione del vento
    for (let i = Inizio; i < Fine; i++) {
        Conta_direzioni_vento = [0, 0, 0, 0, 0, 0, 0, 0] // N S E W NE NW SE SW
        switch (Direzione_vento[i]) {                    //In base alla direzione letta, imposto l'indice in cui devo incrementare il contatore
            case "N": Indice = 0
            case "S": Indice = 1
            case "E": Indice = 2
            case "W": Indice = 3
            case "NE": Indice = 4
            case "NW": Indice = 5
            case "SE": Indice = 6
            case "SW": Indice = 7
        }
        Conta_direzioni_vento.insertAt(Indice, Conta_direzioni_vento[Indice] + 1)  //Incremento di 1 il contatore della direzione corrispondente all'indice trovato
    }
    Indice = Conta_direzioni_vento[0]
    for (let i = 1; i <= 7; i++) {
        if (Conta_direzioni_vento[i] > Indice) {
            Indice = Conta_direzioni_vento[i]    //Trovo l'indice corrispondente al valore più alto tra i contatori delle varie direzioni
        }
    }
    Indice = Conta_direzioni_vento.indexOf(Indice)  //Imposto l'indice al valore più alto trovato e determino la direzione corrispondente, che scrivo in una variabile
    switch (Indice) {
        case 0: Dato_direzione_vento = "N"
        case 1: Dato_direzione_vento = "S"
        case 2: Dato_direzione_vento = "E"
        case 3: Dato_direzione_vento = "W"
        case 4: Dato_direzione_vento = "NE"
        case 5: Dato_direzione_vento = "NW"
        case 6: Dato_direzione_vento = "SE"
        case 7: Dato_direzione_vento = "SW"
    }
    Direzione_vento = []
    Salva_direzione_vento.push(Dato_direzione_vento)  //Salvo la variabile in un array
}
function Azzera_array () {  //Questa funzione viene eseguita ogni 24 ore, e serve a liberare gli array dai dati, onde evitare un overflow, previo salvataggio sulla scheda SD
    Salva_su_scheda_SD()
    if (weatherbit.rain() > Pioggia) {
        Pioggia = weatherbit.rain()
    }
    Temperatura_aria = []
    Temperatura_terreno = []
    Umidita_aria = []
    Umidita_terreno = []
    Pressione = []
    Salva_direzione_vento = []
    Salva_velocita_vento = []
    Pioggia_caduta = 0
}
function Salva_su_scheda_SD () {  //Salva tutti i valori di tutti gli array nella scheda.
    for (let i=0; i < Temperatura_aria.length()-1; i++) {
	    serial.writeValue("Temperatura aria=", Temperatura_aria[i])
    }
    for (let i=0; i < Temperatura_terreno.length()-1; i++) {
	    serial.writeValue("Temperatura terra=", Temperatura_terreno[i])
    }
    for (let i=0; i < Umidita_aria.length()-1; i++) {
	    serial.writeValue("Umidità aria=", Umidita_aria[i])
    }
    for (let i=0; i < Umidita_terreno.length()-1; i++) {
	    serial.writeValue("Umidità terra=", Umidita_terreno[i])
    }
    for (let i=0; i < Salva_velocita_vento.length()-1; i++) {
	    serial.writeValue("Velocità vento=", Salva_velocita_vento[i])
    }
    for (let i=0; i < Salva_direzione_vento.length()-1; i++) {
	    serial.writeString(Salva_direzione_vento[i])
    }
    for (let i=0; i < Pressione.length()-1; i++) {
	    serial.writeValue("Pressione=", Pressione[i])
    }
    if (Pioggia_caduta > 0) {
	        serial.writeValue("Pioggia caduta=", Pioggia_caduta)
    }
}
function Arrotonda_2_decimali(Numero:number)  {  //Funzione per rendere i numeri più leggibili e eliminare le cifre meno significative dopo la virgola
    return (Math.round(Numero * 100)) / 100
}
radio.onReceivedMessage(RadioMessage.Umidita, function () {  //Per ogni messaggio radio ricevuto dal display LCD (programma "to-lcd") invio il tempo trascorso dall'ultimo
    Tempo = Math.round(control.millis() / 1000 - Timestamp)  //aggiornamento e il dato richiesto
    radio.sendNumber(Tempo)
    basic.pause(200)
    radio.sendValue("HT", Umidita_terreno[Umidita_terreno.length - 1])
    basic.pause(200)
    radio.sendValue("HA", Umidita_aria[Umidita_aria.length - 1])
})
radio.onReceivedMessage(RadioMessage.Vento, function () {  //Per quanto riguarda il vento non invio il tempo, in quanto il dato viene aggiornato ogni 2 secondi
    basic.pause(200)
    radio.sendValue("VV", Velocita_vento[Velocita_vento.length - 1])
    basic.pause(200)
    radio.sendString(Direzione_vento[Direzione_vento.length - 1])
})
radio.onReceivedMessage(RadioMessage.Pressione, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    basic.pause(200)
    radio.sendValue("PR", Pressione[Pressione.length - 1])
})
radio.onReceivedMessage(RadioMessage.Pioggia, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    basic.pause(200)
    if (Pioggia_caduta = 0) { //Se non piove l'array è vuoto, quindi invio 0
        radio.sendValue("PI", 0)
    } else {
        radio.sendValue("PI", Pioggia_caduta)
    }
})
radio.onReceivedMessage(RadioMessage.Temperatura, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    basic.pause(200)
    radio.sendValue("TT", Temperatura_terreno[Temperatura_terreno.length - 1])
    basic.pause(100)
    radio.sendValue("TA", Temperatura_aria[Temperatura_aria.length - 1])
})
radio.onReceivedMessage(RadioMessage.Thingspeak, function () {  //Messaggio che ricevo dal programma "to-thingspeak" per il caricamento dei dati in Internet,
    if (Contatore > 0) {                                        //ogni 2 decimi di secondo invio tutti gli ultimi dati rilevati
        radio.sendValue("TTTS", Temperatura_terreno[Temperatura_terreno.length - 1])
        basic.pause(200)
        radio.sendValue("TATS", Temperatura_aria[Temperatura_aria.length - 1])
        basic.pause(200)
        radio.sendValue("HTTS", Umidita_terreno[Umidita_terreno.length - 1])
        basic.pause(200)
        radio.sendValue("HATS", Umidita_aria[Umidita_aria.length - 1])
        basic.pause(200)
        radio.sendValue("PRTS", Pressione[Pressione.length - 1])
        basic.pause(200)
        radio.sendValue("VVTS", Salva_velocita_vento[Salva_velocita_vento.length - 1])
        basic.pause(200)
        if (Pioggia_caduta != 0) {   //Se non piove... perchè inviare il dato?
            radio.sendValue("PITS", Pioggia_caduta)
        } 
    }
})
input.onButtonPressed(Button.AB, function () {  //Uso i bottoni A+B della microbit per sapere da quanti giorni la stazione meteo è in esecuzione
    led.enable(true)
    basic.showString("In esecuzione da " + Math.round(((control.millis() / 1000) / 3600) / 24) + " giorni")
    basic.clearScreen()
    led.enable(false)
})
input.onButtonPressed(Button.A, function () {  //Uso il bottone A per impostare l'ora quando accendo la microbit per la prima volta
    led.enable(true)
    if (Ora <= 24) {
        Ora += 1
    }
    else {
        Ora = 1
    }
    basic.showNumber(Ora)
})
input.onButtonPressed(Button.B, function () {  //Uso il bottone B per confermare l'ora e impostare il reset giornaliero alle 24
    Ora = 24 - Ora
    Contatore = 17280 - (Ora * 17280 / 24)  //Imposto il contatore in modo che alle 24 si azzeri
    led.enable(false)  
})
let Ora = 1
let Contatore_vento = 0
let Contatore = 0
let Timestamp = 0
let Tempo = 0
let Indice = 0
let Vento = 0
let Pioggia_caduta = 0
let Pioggia = 0
let Dato_direzione_vento = ""
let Conta_direzioni_vento: number[] = []
let Salva_direzione_vento: string[] = []
let Salva_velocita_vento: number[] = []
let Direzione_vento: string[] = []
let Velocita_vento: number[] = []
let Pressione: number[] = []
let Umidita_terreno: number[] = []
let Temperatura_terreno: number[] = []
let Umidita_aria: number[] = []
let Temperatura_aria: number[] = []
radio.setTransmitPower(7)  //Inizializzo la potenza dell'antenna radio al massimo, in modo da garantire la comunicaizone radio entro 10-20 metri
radio.setGroup(93)  //Il canale dovrà essere egualmente impostato in tutte le altre microbit coinvolte
serial.redirect(SerialPin.P15, SerialPin.P14, 9600)  //I pin 14 e 15 sono dedicati al salvataggio sulla scheda SD
basic.showIcon(IconNames.Happy)
basic.clearScreen()
led.enable(false)
basic.forever(function () {
    weatherbit.startWeatherMonitoring()
    Temperatura_aria.push(weatherbit.temperature() / 100)  //Divido per 100 per trovare la temperatura in gradi Celsius
    if (convertToText(Temperatura_aria[Temperatura_aria.length - 1]) == "NaN") {
        Temperatura_aria.pop()
    }
    Umidita_aria.push(Math.round(weatherbit.humidity() / 1024)) //Divido per 1024 per trovare l'umidità in percentuale
    if (convertToText(Umidita_aria[Umidita_aria.length - 1]) == "NaN") {
        Umidita_aria.pop()
    }
    Pressione.push(Arrotonda_2_decimali(weatherbit.pressure() / 256))  //Divido per 25600 per trovare gli hPa corrispondenti
    if (convertToText(Pressione[Pressione.length - 1]) == "NaN") {
        Pressione.pop()
    }
    Temperatura_terreno.push(weatherbit.soilTemperature() / 100)  
    if (convertToText(Temperatura_terreno[Temperatura_terreno.length - 1]) == "NaN" || (Temperatura_terreno[Temperatura_terreno.length - 1] < -20 || Temperatura_terreno[Temperatura_terreno.length - 1] > 60)) {
        Temperatura_terreno.pop()
    }
    Umidita_terreno.push(Math.round(Math.map(weatherbit.soilMoisture(), 0, 1023, 0, 100)))  //Mappo il valore analogico in ingresso per trovare la relativa percentuale
    if (convertToText(Umidita_terreno[Umidita_terreno.length - 1]) == "NaN") {
        Umidita_terreno.pop()
    }
    weatherbit.startRainMonitoring() //Funzione dedicata solo al monitoraggio della pioggia
    if (weatherbit.rain() - Pioggia > 0) {
        Pioggia_caduta = (weatherbit.rain() - Pioggia)* 25.4  //Trasformo la misura da pollici a millimetri
    }
    Timestamp = Math.round(control.millis() / 1000)  //Salvo il timestamp degli ultimi rilevamenti effettuati
    basic.pause(300000)         //Aspetto 5 minuti prima di effettuare nuovi rilevamenti
    Contatore += 1
    if (Contatore == 17280) {   //Ogni 24 ore chiamo la funzione per salvare i dati della giornata e azzerare tutto
        Contatore = 0
        Azzera_array()
    }
})
basic.forever(function () {  //Funzione dedicata solo al monitoraggio del vento, che avviene ogni 2 secondi per garantire più precisione e completezza dei dati
    weatherbit.startWindMonitoring()
    Velocita_vento.push(Arrotonda_2_decimali(weatherbit.windSpeed() * 1.60934))  //Converto la velocità da MPH in KMH e la arrotondo
    if (convertToText(Velocita_vento[Velocita_vento.length - 1]) == "NaN") {
        Velocita_vento.pop()
    }
    Direzione_vento.push(weatherbit.windDirection())
    if (Direzione_vento[Direzione_vento.length - 1] == "???") {
        Direzione_vento.pop()
    }
    Contatore_vento += 1
    if (Contatore_vento == 150) {  //Ogni 5 minuti, calcolo la media della velocità e della direzione
        Media_velocita_vento(0, Velocita_vento.length)
        Media_direzione_vento(0, Direzione_vento.length)
        Contatore_vento = 0
    }
    basic.pause(2000)
})
