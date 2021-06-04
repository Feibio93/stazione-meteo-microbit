/*Il programma mostra i dati ricevuti sul display LCD. Tramite il bottone A della microbit è possibile scorrere tra i tipi di dati che si vogliono sapere,
il bottone B invia la richiesta e stampa sul display i secondi/minuti dall'ultimo aggiornamento e il valore ricevuto.

Prima di iniziare va aggiunta l'estensione 'VIEWTEXT'*/


enum RadioMessage { //Uso i nomi al posto delle cifre per chiarezza e maggiore comprensione
    Vento = 8497,
    Umidita = 13399,
    Pressione = 14277,
    Temperatura = 36566,
    Pioggia = 58249
}
radio.onReceivedNumber(function (receivedNumber) { //Salva sulla variabile Timestamp il tempo passato dall'ultimo aggiornamento della stazione
    Timestamp = receivedNumber
})
radio.onReceivedString(function (receivedString) { //Se è una stringa valida, salva la direzione del vento
    if (receivedString.length < 3 && (receivedString.includes("N") || (receivedString.includes("S") || (receivedString.includes("W") || receivedString.includes("E"))))) {
        Direzione_vento = "DIREZIONE: " + receivedString
    }
})
radio.onReceivedValue(function (name, value) { //Per ogni dato ricevuto dalla stazione, salva la stringa corrispondente da mostrare nella prima riga (Valore_1) o nella
    if (name == "TT") {                        //seconda riga (Valore_2) del display LCD
        Valore_1 = "TERRA: " + value + " C "
    }
    if (name == "HT") {
        Valore_1 = "TERRA: " + value + "%    "
    }
    if (name == "VV") {
        Valore_1 = "VEL: " + value + " km/h "
    }
    if (name == "PR") {
        Valore_1 = "PRESSIONE: " + value + " hPa "
    }
    if (name == "TA") {
        Valore_2 = "ARIA: " + value + " C "
    }
    if (name == "HA") {
        Valore_2 = "ARIA: " + value + "% "
    }
    if (name == "PI") {  //Se riceve il valore 0... non piove!
        if (value == 0) {
            Valore_1 = "...non piove!"
        } else {
            Valore_1 = "PIOGGIA CADUTA: " + value + " millimetri"
        }
    }
})
input.onButtonPressed(Button.A, function () {  //Tramite il bottone A scorre nel menù di navigazione salvando la posizione corrispondente
    if (Posizione == 0) {
        Kitronik_VIEWTEXT32.showString("Cosa si cerca? " + "TEMPERATURA")
        Posizione += 1
    } else if (Posizione == 1) {
        Kitronik_VIEWTEXT32.showString("Cosa si cerca? " + "UMIDITA'")
        Posizione += 1
    } else if (Posizione == 2) {
        Kitronik_VIEWTEXT32.showString("Cosa si cerca? " + "PRESSIONE")
        Posizione += 1
    } else if (Posizione == 3) {
        Kitronik_VIEWTEXT32.showString("Cosa si cerca? " + "VENTO")
        Posizione += 1
    } else if (Posizione == 4) {
        Kitronik_VIEWTEXT32.showString("Cosa si cerca? " + "PIOGGIA CADUTA")
        Posizione = 0
    }
})
input.onButtonPressed(Button.AB, function () {  //Premendo contemporaneamente i bottoni A e B torna al menù iniziale
    Kitronik_VIEWTEXT32.clearDisplay()
    Posizione = 0
    Kitronik_VIEWTEXT32.showString("A -> SELEZIONA  B -> CONFERMA")
})
input.onButtonPressed(Button.B, function () {  //Il bottone B è il bottone di conferma, in base alla posizione scelta con A invia il messaggio radio corrispondente
    Kitronik_VIEWTEXT32.clearDisplay()
    if (Posizione == 1) {
        radio.sendMessage(RadioMessage.Temperatura)
    } else if (Posizione == 2) {
        radio.sendMessage(RadioMessage.Umidita)
    } else if (Posizione == 3) {
        radio.sendMessage(RadioMessage.Pressione)
    } else if (Posizione == 4) {
        radio.sendMessage(RadioMessage.Vento)
    } else if (Posizione == 0) {
        radio.sendMessage(RadioMessage.Pioggia)
    }  //Animazione di caricamento dati
    led.plot(4, 2)
    basic.pause(200)
    led.unplot(4, 2)
    led.plot(3, 2)
    basic.pause(200)
    led.unplot(3, 2)
    led.plot(2, 2)
    basic.pause(200)
    led.unplot(2, 2)
    led.plot(1, 2)
    basic.pause(200)
    led.unplot(1, 2)
    led.plot(0, 2)
    basic.pause(200)
    led.unplot(0, 2)
    if (Posizione != 4) {
        if (Timestamp == 0) {  //Se non ha ricevuto il timestamp, vuol dire che la connessione con la stazione è fallita.
            Kitronik_VIEWTEXT32.showString("Connessione con la stazione non riuscita. Riprova.")
        } else {
            if (Timestamp >= 120) { //minuti al plurale
                Kitronik_VIEWTEXT32.showString("Ultimo aggiornamento " + Math.round(Timestamp / 60) + " minuti fa")
            } else if (Timestamp < 60) { //Se è meno di un minuto, mostra i secondi esatti
                Kitronik_VIEWTEXT32.showString("Ultimo aggiornamento " + Timestamp + " secondi fa")
            } else {
                Kitronik_VIEWTEXT32.showString("Ultimo aggiornamento 1 minuto fa")
            }
        }
    }
    if (Posizione == 4) {  //Se la posizione è 4 vuol dire che ha richiesto i dati sul vento, che si aggiorna ogni 2 secondi, e quindi non riceve dati sul timestamp
        if (Valore_1 == "" && Valore_2 == "") { //Se i campi sul vento sono vuoti, la connessione è fallita
            Kitronik_VIEWTEXT32.showString("Connessione con la stazione non riuscita. Riprova.")
            basic.pause(500)
            Kitronik_VIEWTEXT32.clearDisplay()
        } else {  //Mostra la velocità sulla prima riga del display e la direzione sulla seconda riga del display
            Kitronik_VIEWTEXT32.showString(Valore_1 + Direzione_vento)
            Posizione += 1
        }
    } else {
        basic.pause(500)
        Kitronik_VIEWTEXT32.clearDisplay()
        basic.pause(500)
    }
    if (Timestamp != 0) { //Se il timestamp è diverso da 0 vuol dire che ha ricevuto i dati, quindi li mostra. Se la posizione è su temperatura o pressione, mostra solo 1 dato
        if (Posizione == 0 || Posizione == 3) {
            Kitronik_VIEWTEXT32.showString(Valore_1)
        } else {
            Kitronik_VIEWTEXT32.showString(Valore_1 + Valore_2)
        }
    } else {  //Se il timestamp è 0 il caricamento dei dati è fallito, quindi premendo A torna alla voce selezionata in precedenza per riprovare la connessione
        if (Posizione == 0) {
                Posizione = 4
            } else {
                Posizione -= 1
            }
    }
    Valore_1 = ""
    Valore_2 = ""
    Timestamp = 0
})
let Valore_2 = ""
let Valore_1 = ""
let Direzione_vento = ""
let Posizione = 0
let Timestamp = 0
led.enable(true)
led.setBrightness(20)
Kitronik_VIEWTEXT32.showString("A -> SELEZIONA  B -> CONFERMA")  //Mostra le azioni da eseguire premendo i bottoni A e B della microbit
radio.setTransmitPower(7)
radio.setGroup(93)
