enum RadioMessage {
    Vento = 8497,
    Umidita = 13399,
    Pressione = 14277,
    Temperatura = 36566,
    Thingspeak = 55204,
    Pioggia = 58249
}
function Azzera_array () {
    Salva_su_scheda_SD()
    Altitudine = []
    Pioggia_caduta = []
    Pressione = []
    Temperatura_aria = []
    Temperatura_terreno = []
    Umidita_aria = []
    Umidita_terreno = []
    Salva_direzione_vento = []
    Salva_velocità_vento = []
}
radio.onReceivedMessage(RadioMessage.Umidita, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    basic.pause(200)
    radio.sendValue("HT", Umidita_terreno[Umidita_terreno.length - 1])
    basic.pause(200)
    radio.sendValue("HA", Umidita_aria[Umidita_aria.length - 1])
})
input.onButtonPressed(Button.A, function () {
    led.enable(true)
    basic.showString("VEL VENTO:")
    for (let Indice = 0; Indice <= Velocita_vento.length - 1; Indice++) {
        basic.showNumber(Velocita_vento[Indice])
    }
    basic.showString("DIR VENTO:")
    for (let Indice = 0; Indice <= Direzione_vento.length - 1; Indice++) {
        basic.showString("" + (Direzione_vento[Indice]))
    }
    basic.clearScreen()
    led.enable(false)
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
function Media_velocità_vento (Inizio: number, Fine: number) {
    Indice = Inizio
    for (let index = 0; index < Fine; index++) {
        Vento = Vento + Velocita_vento[Indice]
        Indice += -1
    }
    Vento = Vento / (Fine + 1)
    Velocita_vento = []
    Salva_velocità_vento.push(Vento)
    Vento = 0
}
function Media_direzione_vento (Inizio: number, Fine: number) {
    Indice_ogni_5_minuti = Inizio
    Indice2 = Fine
    for (let index = 0; index < Fine; index++) {
        // N S E W NE NW SE SW
        Conta_direzioni_vento = [0, 0, 0, 0, 0, 0, 0, 0]
        for (let index = 0; index < Indice_ogni_5_minuti; index++) {
            if (Direzione_vento[Indice2] == "N") {
                Indice3 = 0
            } else if (Direzione_vento[Indice2] == "S") {
                Indice3 = 1
            } else if (Direzione_vento[Indice2] == "E") {
                Indice3 = 2
            } else if (Direzione_vento[Indice2] == "W") {
                Indice3 = 3
            } else if (Direzione_vento[Indice2] == "NE") {
                Indice3 = 4
            } else if (Direzione_vento[Indice2] == "NW") {
                Indice3 = 5
            } else if (Direzione_vento[Indice2] == "SE") {
                Indice3 = 6
            } else if (Direzione_vento[Indice2] == "SW") {
                Indice3 = 7
            }
            Conta_direzioni_vento.insertAt(Indice3, Conta_direzioni_vento[Indice3] + 1)
            Indice2 += -1
        }
        Indice2 = Conta_direzioni_vento[0]
        for (let Indice = 0; Indice <= 7; Indice++) {
            if (Conta_direzioni_vento[Indice] > Indice2) {
                Indice2 = Conta_direzioni_vento[Indice]
            }
        }
        Indice3 = Conta_direzioni_vento.indexOf(Indice2)
        if (Indice3 == 0) {
            Dato_direzione_vento = "N"
        } else if (Indice3 == 1) {
            Dato_direzione_vento = "S"
        } else if (Indice3 == 2) {
            Dato_direzione_vento = "E"
        } else if (Indice3 == 3) {
            Dato_direzione_vento = "W"
        } else if (Indice3 == 4) {
            Dato_direzione_vento = "NE"
        } else if (Indice3 == 5) {
            Dato_direzione_vento = "NW"
        } else if (Indice3 == 6) {
            Dato_direzione_vento = "SE"
        } else if (Indice3 == 7) {
            Dato_direzione_vento = "SW"
        }
        Direzione_vento = []
        Salva_direzione_vento.push(Dato_direzione_vento)
    }
}
radio.onReceivedMessage(RadioMessage.Temperatura, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    // basic.pause(200)
    // radio.sendValue("TT", Temperatura_terreno[Temperatura_terreno.length - 1])
    basic.pause(200)
    radio.sendValue("TA", Temperatura_aria[Temperatura_aria.length - 1])
})
function Salva_su_scheda_SD () {
	
}
radio.onReceivedMessage(RadioMessage.Thingspeak, function () {
    if (Contatore > 0) {
        // radio.sendValue("TTTS", Temperatura_terreno[Temperatura_terreno.length - 1])
        // basic.pause(500)
        radio.sendValue("TATS", Temperatura_aria[Temperatura_aria.length - 1])
        basic.pause(200)
        radio.sendValue("HTTS", Umidita_terreno[Umidita_terreno.length - 1])
        basic.pause(200)
        radio.sendValue("HATS", Umidita_aria[Umidita_aria.length - 1])
        basic.pause(200)
        radio.sendValue("ALTS", Altitudine[Altitudine.length - 1])
        basic.pause(200)
        radio.sendValue("PRTS", Pressione[Pressione.length - 1])
        basic.pause(200)
        radio.sendValue("VVTS", Velocita_vento[Velocita_vento.length - 1])
        if (Umidita_terreno[Umidita_terreno.length - 1] > 85) {
            radio.sendValue("PITS", Pioggia_caduta[Pioggia_caduta.length - 1])
        }
    }
})
radio.onReceivedMessage(RadioMessage.Vento, function () {
    radio.sendValue("VV", Salva_velocità_vento[Salva_velocità_vento.length - 1])
    basic.pause(200)
    radio.sendString("" + (Salva_direzione_vento[Salva_direzione_vento.length - 1]))
})
radio.onReceivedMessage(RadioMessage.Pressione, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    basic.pause(200)
    radio.sendValue("PR", Pressione[Pressione.length - 1])
    basic.pause(200)
    radio.sendValue("AL", Altitudine[Altitudine.length - 1])
})
let Dato_direzione_vento = ""
let Indice3 = 0
let Conta_direzioni_vento: number[] = []
let Indice2 = 0
let Indice_ogni_5_minuti = 0
let Indice = 0
let Timestamp = 0
let Tempo = 0
let Contatore = 0
let Vento = 0
let Salva_direzione_vento: string[] = []
let Salva_velocità_vento: number[] = []
let Direzione_vento: string[] = []
let Velocita_vento: number[] = []
let Altitudine: number[] = []
let Pressione: number[] = []
let Umidita_terreno: number[] = []
let Temperatura_terreno: number[] = []
let Umidita_aria: number[] = []
let Temperatura_aria: number[] = []
let Pioggia_caduta: number[] = []
radio.setTransmitPower(7)
radio.setGroup(93)
led.enable(false)
Pioggia_caduta = []
Temperatura_aria = []
Umidita_aria = []
Temperatura_terreno = []
Umidita_terreno = []
Pressione = []
Altitudine = []
Velocita_vento = []
Direzione_vento = []
Salva_velocità_vento = []
Salva_direzione_vento = []
Vento = 0
Contatore = 0
let Contatore_vento = 0
basic.forever(function () {
    weatherbit.startWeatherMonitoring()
    weatherbit.startWindMonitoring()
    Temperatura_aria.push(weatherbit.temperature() / 100)
    if (convertToText(Temperatura_aria[Temperatura_aria.length - 1]) == "NaN") {
        Temperatura_aria.pop()
    }
    Umidita_aria.push(Math.round(weatherbit.humidity() / 1024))
    if (convertToText(Umidita_aria[Umidita_aria.length - 1]) == "NaN") {
        Umidita_aria.pop()
    }
    Pressione.push(weatherbit.pressure() / 256)
    if (convertToText(Pressione[Pressione.length - 1]) == "NaN") {
        Pressione.pop()
    }
    if (convertToText(Pressione[Pressione.length - 1]).length > 8) {
        Pressione.insertAt(Pressione.length - 1, Math.round(Pressione[Pressione.length - 1] * 100) / 100)
    }
    Altitudine.push(weatherbit.altitude())
    if (convertToText(Altitudine[Altitudine.length - 1]) == "NaN") {
        Altitudine.pop()
    }
    Direzione_vento.push(weatherbit.windDirection())
    if (Direzione_vento[Direzione_vento.length - 1] == "null") {
        Direzione_vento.pop()
    }
    // Temperatura_terreno.push(weatherbit.soilTemperature() / 100)
    // if (convertToText(Temperatura_terreno[Temperatura_terreno.length - 1]) == "NaN" || (Temperatura_terreno[Temperatura_terreno.length - 1] < -20 || Temperatura_terreno[Temperatura_terreno.length - 1] > 60)) {
    // while (Temperatura_terreno[Temperatura_terreno.length - 1] < -20 || Temperatura_terreno[Temperatura_terreno.length - 1] > 60) {
    // Temperatura_terreno.pop()
    // Temperatura_terreno.push(weatherbit.soilTemperature() / 100)
    // }
    // }
    Umidita_terreno.push(Math.round(Math.map(weatherbit.soilMoisture(), 0, 1023, 0, 100)))
    if (convertToText(Umidita_terreno[Umidita_terreno.length - 1]) == "NaN") {
        Umidita_terreno.pop()
    }
    if (Umidita_aria[Umidita_aria.length - 1] > 85) {
        weatherbit.startRainMonitoring()
        Pioggia_caduta.push(Math.round(weatherbit.rain() * 25.4))
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
    Velocita_vento.push(Math.round(weatherbit.windSpeed() * 1.60934 * 100) / 100)
    if (convertToText(Velocita_vento[Velocita_vento.length - 1]) == "NaN") {
        Velocita_vento.pop()
    }
    Contatore_vento += 1
    if (Contatore_vento == 150) {
        Media_velocità_vento(0, Velocita_vento.length - 1)
        Media_direzione_vento(0, Direzione_vento.length - 1)
        Contatore_vento = 0
    }
    basic.pause(2000)
})
