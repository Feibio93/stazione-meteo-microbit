enum RadioMessage {
    Vento = 8497,
    Umidita = 13399,
    Pressione = 14277,
    Temperatura = 36566,
    Thingspeak = 55204,
    Pioggia = 58249
}
function Media_velocita_vento (Inizio: number, Fine: number) {
    for (let i = Inizio; i < Fine; i++) {
        Vento = Vento + Velocita_vento[i]
    }
    Vento = Arrotonda_2_decimali(Vento / Fine)
    Velocita_vento = []
    Salva_velocita_vento.push(Vento)
    Vento = 0
}
function Media_direzione_vento (Inizio: number, Fine: number) {
    for (let i = Inizio; i < Fine; i++) {
        Conta_direzioni_vento = [0, 0, 0, 0, 0, 0, 0, 0] // N S E W NE NW SE SW
        switch (Direzione_vento[i]) {
            case "N": Indice = 0
            case "S": Indice = 1
            case "E": Indice = 2
            case "W": Indice = 3
            case "NE": Indice = 4
            case "NW": Indice = 5
            case "SE": Indice = 6
            case "SW": Indice = 7
        }
        Conta_direzioni_vento.insertAt(Indice, Conta_direzioni_vento[Indice] + 1)
    }
    Indice = Conta_direzioni_vento[0]
    for (let i = 1; i <= 7; i++) {
        if (Conta_direzioni_vento[i] > Indice) {
            Indice = Conta_direzioni_vento[i]
        }
    }
    Indice = Conta_direzioni_vento.indexOf(Indice)
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
    Salva_direzione_vento.push(Dato_direzione_vento)
}
function Azzera_array () {
    Salva_su_scheda_SD()
    Pioggia_caduta = []
    Pressione = []
    Temperatura_aria = []
    Temperatura_terreno = []
    Umidita_aria = []
    Umidita_terreno = []
    Salva_direzione_vento = []
    Salva_velocita_vento = []
}
function Salva_su_scheda_SD () {
    for (let i=0; i < Temperatura_aria.length()-1; i++) {
	    serial.writeValue("Temperatura aria", Temperatura_aria[i])
    }
    for (let i=0; i < Umidita_aria.length()-1; i++) {
	    serial.writeValue("Umidità aria", Umidita_aria[i])
    }
    for (let i=0; i < Umidita_terreno.length()-1; i++) {
	    serial.writeValue("Umidità terra", Umidita_terreno[i])
    }
    for (let i=0; i < Salva_velocita_vento.length()-1; i++) {
	    serial.writeValue("Velocità vento", Salva_velocita_vento[i])
    }
    for (let i=0; i < Salva_direzione_vento.length()-1; i++) {
	    serial.writeString(Salva_direzione_vento[i])
    }
    for (let i=0; i < Pressione.length()-1; i++) {
	    serial.writeValue("Pressione", Pressione[i])
    }
    if (Pioggia_caduta.length() > 1) {
        for (let i=0; i < Pioggia_caduta.length()-1; i++) {
	        serial.writeValue("Pioggia caduta", Pioggia_caduta[i])
        }
    }
}
function Arrotonda_2_decimali(Numero:number)  {
    return Math.round(Numero * 100) / 100
}
radio.onReceivedMessage(RadioMessage.Umidita, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    basic.pause(200)
    radio.sendValue("HT", Umidita_terreno[Umidita_terreno.length - 1])
    basic.pause(200)
    radio.sendValue("HA", Umidita_aria[Umidita_aria.length - 1])
})
radio.onReceivedMessage(RadioMessage.Vento, function () {
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
    if (Pioggia_caduta.length == 0) {
        radio.sendValue("PI", 0)
    } else {
        radio.sendValue("PI", Pioggia_caduta[Pioggia_caduta.length - 1])
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
radio.onReceivedMessage(RadioMessage.Thingspeak, function () {
    if (Contatore > 0) {
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
        if (Pioggia_caduta[Pioggia_caduta.length - 1] > 0) {
            radio.sendValue("PITS", Pioggia_caduta[Pioggia_caduta.length - 1])
        }
    }
})
input.onButtonPressed(Button.A, function () {
    led.enable(true)
    basic.showString("In esecuzione da " + Math.round(((control.millis() / 1000) / 3600) / 24) + " giorni")
    basic.clearScreen()
    led.enable(false)
})
let Contatore_vento = 0
let Contatore = 0
let Timestamp = 0
let Tempo = 0
let Indice = 0
let Vento = 0
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
let Pioggia_caduta: number[] = []
radio.setTransmitPower(7)
radio.setGroup(93)
serial.redirect(SerialPin.P15, SerialPin.P14, 9600)
basic.showIcon(IconNames.Happy)
basic.clearScreen()
led.enable(false)
basic.forever(function () {
    weatherbit.startWeatherMonitoring()
    Temperatura_aria.push(weatherbit.temperature() / 100)
    if (convertToText(Temperatura_aria[Temperatura_aria.length - 1]) == "NaN") {
        Temperatura_aria.pop()
    }
    Umidita_aria.push(Math.round(weatherbit.humidity() / 1024))
    if (convertToText(Umidita_aria[Umidita_aria.length - 1]) == "NaN") {
        Umidita_aria.pop()
    }
    Pressione.push(Arrotonda_2_decimali(weatherbit.pressure() / 256) / 100)
    if (convertToText(Pressione[Pressione.length - 1]) == "NaN") {
        Pressione.pop()
    }
    Temperatura_terreno.push(weatherbit.soilTemperature() / 100)
     if (convertToText(Temperatura_terreno[Temperatura_terreno.length - 1]) == "NaN" || (Temperatura_terreno[Temperatura_terreno.length - 1] < -20 || Temperatura_terreno[Temperatura_terreno.length - 1] > 60)) {
     while (Temperatura_terreno[Temperatura_terreno.length - 1] < -20 || Temperatura_terreno[Temperatura_terreno.length - 1] > 60) {
     Temperatura_terreno.pop()
     Temperatura_terreno.push(weatherbit.soilTemperature() / 100)
     }
    }
    Umidita_terreno.push(Math.round(Math.map(weatherbit.soilMoisture(), 0, 1023, 0, 100)))
    if (convertToText(Umidita_terreno[Umidita_terreno.length - 1]) == "NaN") {
        Umidita_terreno.pop()
    }
    weatherbit.startRainMonitoring()
    Pioggia_caduta.push(Arrotonda_2_decimali(weatherbit.rain() * 25.4))
    if (Pioggia_caduta[Pioggia_caduta.length() - 1] == 0) {
        Pioggia_caduta.pop()
    }
    Timestamp = Math.round(control.millis() / 1000)
    basic.pause(300000)
    Contatore += 1
    if (Contatore == 17280) {
        Contatore = 0
        Azzera_array()
    }
})
basic.forever(function () {
    weatherbit.startWindMonitoring()
    Velocita_vento.push(Arrotonda_2_decimali(weatherbit.windSpeed() * 1.60934))
    if (convertToText(Velocita_vento[Velocita_vento.length - 1]) == "NaN") {
        Velocita_vento.pop()
    }
    Direzione_vento.push(weatherbit.windDirection())
    if (Direzione_vento[Direzione_vento.length - 1] == "???") {
        Direzione_vento.pop()
    }
    Contatore_vento += 1
    if (Contatore_vento == 150) {
        Media_velocita_vento(0, Velocita_vento.length)
        Media_direzione_vento(0, Direzione_vento.length)
        Contatore_vento = 0
    }
    basic.pause(2000)
})
