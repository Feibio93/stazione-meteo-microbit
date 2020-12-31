/*Il programma mostra i dati ricevuti sul display LCD. Tramite il bottone A della microbit è possibile scorrere tra i tipi di dati che si vogliono sapere,
il bottone B invia la richiesta e stampa sul display i secondi/minuti dall'ultimo aggiornamento e il valore ricevuto.*/
//Prima di iniziare va aggiunta l'estensione 'VIEWTEXT'
enum RadioMessage {
    Vento = 8497,
    Umidita = 13399,
    Pressione = 14277,
    Temperatura = 36566,
    Pioggia = 58249
}
radio.onReceivedNumber(function (receivedNumber) {
    Timestamp = receivedNumber
})
radio.onReceivedString(function (receivedString) {
    if (receivedString.length < 3 && (receivedString.includes("N") || (receivedString.includes("S") || (receivedString.includes("W") || receivedString.includes("E"))))) {
        Direzione_vento = "DIREZIONE: " + receivedString
    }
})
radio.onReceivedValue(function (name, value) {
    if (name == "TT") {
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
    if (name == "PI") {
        if (value == 0) {
            Valore_1 = "...non piove!"
        } else {
            Valore_1 = "PIOGGIA CADUTA: " + value + " millimetri"
        }
    }
})
input.onButtonPressed(Button.A, function () {
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
input.onButtonPressed(Button.AB, function () {
    Kitronik_VIEWTEXT32.clearDisplay()
    Posizione = 0
    Kitronik_VIEWTEXT32.showString("A -> SELEZIONA  B -> CONFERMA")
})
input.onButtonPressed(Button.B, function () {
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
    }
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
        if (Timestamp == 0) {
            Kitronik_VIEWTEXT32.showString("Connessione con la stazione non riuscita. Riprova.")
        } else {
            if (Timestamp >= 120) {
                Kitronik_VIEWTEXT32.showString("Ultimo aggiornamento " + Math.round(Timestamp / 60) + " minuti fa")
            } else if (Timestamp < 60) {
                Kitronik_VIEWTEXT32.showString("Ultimo aggiornamento " + Timestamp + " secondi fa")
            } else {
                Kitronik_VIEWTEXT32.showString("Ultimo aggiornamento 1 minuto fa")
            }
        }
    }
    if (Posizione == 4) {
        if (Valore_1 == "" && Valore_2 == "") {
            Kitronik_VIEWTEXT32.showString("Connessione con la stazione non riuscita. Riprova.")
            basic.pause(500)
            Kitronik_VIEWTEXT32.clearDisplay()
        } else {
            Kitronik_VIEWTEXT32.showString(Valore_1 + Direzione_vento)
            Posizione += 1
        }
    } else {
        basic.pause(500)
        Kitronik_VIEWTEXT32.clearDisplay()
        basic.pause(500)
    }
    if (Timestamp != 0) {
        if (Posizione == 0 || Posizione == 3) {
            Kitronik_VIEWTEXT32.showString(Valore_1)
        } else {
            Kitronik_VIEWTEXT32.showString(Valore_1 + Valore_2)
        }
    } else {
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
Kitronik_VIEWTEXT32.showString("A -> SELEZIONA  B -> CONFERMA")
radio.setTransmitPower(7)
radio.setGroup(93)
