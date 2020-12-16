enum RadioMessage {
    Vento = 8497,
    Umidita = 13399,
    Pressione = 14277,
    Temperatura = 36566,
    Thingspeak = 55204,
    Pioggia = 58249
}
function Media_direzione_vento (Inizio: number, Fine: number) {
    Indice_ogni_5_minuti = Inizio
    for (let i = 0; i < Fine; i++) {
        // N S E W NE NW SE SW
        Conta_direzioni_vento = [0, 0, 0, 0, 0, 0, 0, 0]
        for (let j = 0; j < Indice_ogni_5_minuti; j++) {
            if (Direzione_vento[j] == "N") {
                Indice2 = 0
            } else if (Direzione_vento[j] == "S") {
                Indice2 = 1
            } else if (Direzione_vento[j] == "E") {
                Indice2 = 2
            } else if (Direzione_vento[j] == "W") {
                Indice2 = 3
            } else if (Direzione_vento[j] == "NE") {
                Indice2 = 4
            } else if (Direzione_vento[j] == "NW") {
                Indice2 = 5
            } else if (Direzione_vento[j] == "SE") {
                Indice2 = 6
            } else if (Direzione_vento[j] == "SW") {
                Indice2 = 7
            }
            Conta_direzioni_vento.insertAt(Indice2, Conta_direzioni_vento[Indice2] + 1)
        }
        Indice2 = Conta_direzioni_vento[0]
        for (let i = 0; i <= 7; i++) {
            if (Conta_direzioni_vento[i] > Indice2) {
                Indice2 = Conta_direzioni_vento[i]
            }
        }
        Indice = Conta_direzioni_vento.indexOf(Indice2)
        if (Indice == 0) {
            Dato_direzione_vento = "N"
        } else if (Indice == 1) {
            Dato_direzione_vento = "S"
        } else if (Indice == 2) {
            Dato_direzione_vento = "E"
        } else if (Indice == 3) {
            Dato_direzione_vento = "W"
        } else if (Indice == 4) {
            Dato_direzione_vento = "NE"
        } else if (Indice == 5) {
            Dato_direzione_vento = "NW"
        } else if (Indice == 6) {
            Dato_direzione_vento = "SE"
        } else if (Indice == 7) {
            Dato_direzione_vento = "SW"
        }
        Direzione_vento = []
        Salva_direzione_vento.push(Dato_direzione_vento)
    }
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
    Salva_velocita_vento = []
}
input.onButtonPressed(Button.A, function () {
    led.enable(true)
    basic.showString("VEL VENTO:")
    for (let i = 0; i <= Velocita_vento.length - 1; i++) {
        basic.showNumber(Velocita_vento[i])
    }
    basic.showString("DIR VENTO:")
    for (let i = 0; i <= Direzione_vento.length - 1; i++) {
        basic.showString(Direzione_vento[i])
    }
    basic.clearScreen()
    led.enable(false)
})
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
    for (let i=0; i < Altitudine.length()-1; i++) {
	    serial.writeValue("Altitudine", Altitudine[i])
    }
    if (Pioggia_caduta.length() > 1) {
        for (let i=0; i < Pioggia_caduta.length()-1; i++) {
	        serial.writeValue("Pioggia caduta", Pioggia_caduta[i])
        }
    }
}
function Media_velocita_vento (Inizio: number, Fine: number) {
    for (let i = 0; i < Fine; i++) {
        Vento = Vento + Velocita_vento[i]
    }
    Vento = Vento / (Fine + 1)
    Velocita_vento = []
    Salva_velocita_vento.push(Vento)
    Vento = 0
}
radio.onReceivedMessage(RadioMessage.Umidita, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    basic.pause(200)
    radio.sendValue("HT", Umidita_terreno[Umidita_terreno.length - 1])
    basic.pause(200)
    radio.sendValue("HA", Umidita_aria[Umidita_aria.length - 1])
})
let Contatore_vento = 0
let Timestamp = 0
let Tempo = 0
let Indice = 0
let Dato_direzione_vento = ""
let Conta_direzioni_vento: number[] = []
let Indice2 = 0
let Indice_ogni_5_minuti = 0
let Vento = 0
let Salva_direzione_vento: string[] = []
let Salva_velocita_vento: number[] = []
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
Salva_velocita_vento = []
Salva_direzione_vento = []
Vento = 0
let Contatore = 0
serial.redirect(SerialPin.P15, SerialPin.P14, 9600)
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
        Media_velocita_vento(0, Velocita_vento.length - 1)
        Media_direzione_vento(0, Direzione_vento.length - 1)
        Contatore_vento = 0
    }
    basic.pause(2000)
})
