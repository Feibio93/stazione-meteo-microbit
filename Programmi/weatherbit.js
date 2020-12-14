enum RadioMessage {
    Vento = 8497,
    Umidita = 13399,
    Pressione = 14277,
    Temperatura = 36566,
    Thingspeak = 55204,
    Pioggia = 58249
}
function Azzera_array () {
    Altitudine = []
    Direzione_vento = []
    Velocita_vento = []
    Pioggia_caduta = []
    Pressione = []
    Temperatura_aria = []
    Temperatura_terreno = []
    Umidita_aria = []
    Umidita_terreno = []
}
radio.onReceivedMessage(RadioMessage.Umidita, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    basic.pause(200)
    radio.sendValue("HT", Umidita_terreno[Umidita_terreno.length - 1])
    basic.pause(100)
    radio.sendValue("HA", Umidita_aria[Umidita_aria.length - 1])
})
function Salva_dati_giornalieri (Nr_valori: number, Tipo: string) {
    if (Nr_valori > 1) {
        Indice_ogni_3_ore = Math.round(Nr_valori / 8)
        Indice6 = Nr_valori
        for (let index = 0; index < 8; index++) {
            Calcola_media_ogni_3_ore(Indice6, Indice6 - Indice_ogni_3_ore, Tipo)
            Indice6 = Indice6 - (Indice_ogni_3_ore + 1)
        }
        if (Tipo == "DV") {
            for (let index = 0; index < 8; index++) {
                // N S E W NE NW SE SW
                Conta_direzioni_vento = [0, 0, 0, 0, 0, 0, 0, 0]
                for (let index = 0; index < Indice_ogni_3_ore; index++) {
                    if (Direzione_vento[Indice6] == "N") {
                        Indice22 = 0
                    } else if (Direzione_vento[Indice6] == "S") {
                        Indice22 = 1
                    } else if (Direzione_vento[Indice6] == "E") {
                        Indice22 = 2
                    } else if (Direzione_vento[Indice6] == "W") {
                        Indice22 = 3
                    } else if (Direzione_vento[Indice6] == "NE") {
                        Indice22 = 4
                    } else if (Direzione_vento[Indice6] == "NW") {
                        Indice22 = 5
                    } else if (Direzione_vento[Indice6] == "SE") {
                        Indice22 = 6
                    } else if (Direzione_vento[Indice6] == "SW") {
                        Indice22 = 7
                    }
                    Conta_direzioni_vento.insertAt(Indice22, Conta_direzioni_vento[Indice22] + 1)
                    Indice6 += -1
                }
                Indice22 = Conta_direzioni_vento[0]
                for (let Indice = 0; Indice <= 7; Indice++) {
                    if (Conta_direzioni_vento[Indice] > Indice22) {
                        Indice22 = Conta_direzioni_vento[Indice]
                    }
                }
                Indice22 = Conta_direzioni_vento.indexOf(Indice22)
                if (Indice22 == 0) {
                    Dato_direzione_vento = "N"
                } else if (Indice22 == 1) {
                    Dato_direzione_vento = "S"
                } else if (Indice22 == 2) {
                    Dato_direzione_vento = "E"
                } else if (Indice22 == 3) {
                    Dato_direzione_vento = "W"
                } else if (Indice22 == 4) {
                    Dato_direzione_vento = "NE"
                } else if (Indice22 == 5) {
                    Dato_direzione_vento = "NW"
                } else if (Indice22 == 6) {
                    Dato_direzione_vento = "SE"
                } else if (Indice22 == 7) {
                    Dato_direzione_vento = "SW"
                }
                Salva_direzione_vento.push(Dato_direzione_vento)
            }
        }
    }
}
input.onButtonPressed(Button.A, function () {
    led.enable(true)
    basic.showString("TEMP TERR:")
    for (let Indice2 = 0; Indice2 <= Salva_temperatura_terreno.length - 1; Indice2++) {
        basic.showNumber(Salva_temperatura_terreno[Indice2])
    }
    basic.showString("HUM TERR:")
    for (let Indice3 = 0; Indice3 <= Salva_umidita_terreno.length - 1; Indice3++) {
        basic.showNumber(Salva_umidita_terreno[Indice3])
    }
    basic.showString("VEL VENTO:")
    for (let Indice4 = 0; Indice4 <= Salva_velocita_vento.length - 1; Indice4++) {
        basic.showNumber(Salva_velocita_vento[Indice4])
    }
    basic.showString("DIR VENTO:")
    for (let Indice5 = 0; Indice5 <= Salva_direzione_vento.length - 1; Indice5++) {
        basic.showString("" + (Salva_direzione_vento[Indice5]))
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
radio.onReceivedMessage(RadioMessage.Temperatura, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    //basic.pause(200)
    //radio.sendValue("TT", Temperatura_terreno[Temperatura_terreno.length - 1])
    basic.pause(100)
    radio.sendValue("TA", Temperatura_aria[Temperatura_aria.length - 1])
})
radio.onReceivedMessage(RadioMessage.Thingspeak, function () {
    if (Contatore > 0) {
        //radio.sendValue("TTTS", Temperatura_terreno[Temperatura_terreno.length - 1])
        //basic.pause(500)
        radio.sendValue("TATS", Temperatura_aria[Temperatura_aria.length - 1])
        basic.pause(500)
        radio.sendValue("HTTS", Umidita_terreno[Umidita_terreno.length - 1])
        basic.pause(500)
        radio.sendValue("HATS", Umidita_aria[Umidita_aria.length - 1])
        basic.pause(500)
        radio.sendValue("ALTS", Altitudine[Altitudine.length - 1])
        basic.pause(500)
        radio.sendValue("PRTS", Pressione[Pressione.length - 1])
        basic.pause(500)
        radio.sendValue("VVTS", Velocita_vento[Velocita_vento.length - 1])
        if (Umidita_terreno[Umidita_terreno.length - 1] > 85) {
            radio.sendValue("PITS", Pioggia_caduta[Pioggia_caduta.length - 1])
        }
    }
})
function Calcola_media_ogni_3_ore (Inizio: number, Fine: number, Tipo: string) {
    Dato_ogni_3_ore = 0
    Indice22 = Inizio
    for (let index = 0; index < Inizio - Fine; index++) {
        if (Tipo == "TT") {
            Dato_ogni_3_ore = Dato_ogni_3_ore + Temperatura_terreno[Indice22]
        } else if (Tipo == "TA") {
            Dato_ogni_3_ore = Dato_ogni_3_ore + Temperatura_aria[Indice22]
        } else if (Tipo == "HT") {
            Dato_ogni_3_ore = Dato_ogni_3_ore + Umidita_terreno[Indice22]
        } else if (Tipo == "HA") {
            Dato_ogni_3_ore = Dato_ogni_3_ore + Umidita_aria[Indice22]
        } else if (Tipo == "PR") {
            Dato_ogni_3_ore = Dato_ogni_3_ore + Pressione[Indice22]
        } else if (Tipo == "AL") {
            Dato_ogni_3_ore = Dato_ogni_3_ore + Altitudine[Indice22]
        } else if (Tipo == "VV") {
            Dato_ogni_3_ore = Dato_ogni_3_ore + Velocita_vento[Indice22]
        } else if (Tipo == "PI") {
            Dato_ogni_3_ore = Dato_ogni_3_ore + Pioggia_caduta[Indice22]
        }
        Indice22 += -1
    }
    if (Tipo == "TT") {
        Salva_temperatura_terreno.push(Dato_ogni_3_ore / (Inizio - Fine))
    } else if (Tipo == "TA") {
        let Salva_temperatura_aria: number[] = []
        Salva_temperatura_aria.push(Dato_ogni_3_ore / (Inizio - Fine))
    } else if (Tipo == "HT") {
        Salva_umidita_terreno.push(Dato_ogni_3_ore / (Inizio - Fine))
    } else if (Tipo == "HA") {
        Salva_umidita_aria.push(Dato_ogni_3_ore / (Inizio - Fine))
    } else if (Tipo == "PR") {
        Salva_pressione.push(Dato_ogni_3_ore / (Inizio - Fine))
    } else if (Tipo == "AL") {
        Salva_altitudine.push(Dato_ogni_3_ore / (Inizio - Fine))
    } else if (Tipo == "VV") {
        Salva_velocita_vento.push(Dato_ogni_3_ore / (Inizio - Fine))
    } else if (Tipo == "PI") {
        Salva_pioggia_caduta.push(Dato_ogni_3_ore / (Inizio - Fine))
    }
}
radio.onReceivedMessage(RadioMessage.Vento, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    basic.pause(200)
    radio.sendValue("VV", Velocita_vento[Velocita_vento.length - 1])
    basic.pause(100)
    radio.sendString("" + (Direzione_vento[Direzione_vento.length - 1]))
})
radio.onReceivedMessage(RadioMessage.Pressione, function () {
    Tempo = Math.round(control.millis() / 1000 - Timestamp)
    radio.sendNumber(Tempo)
    basic.pause(200)
    radio.sendValue("PR", Pressione[Pressione.length - 1])
    basic.pause(100)
    radio.sendValue("AL", Altitudine[Altitudine.length - 1])
})
let Dato_ogni_3_ore = 0
let Dato_direzione_vento = ""
let Indice22 = 0
let Conta_direzioni_vento: number[] = []
let Indice6 = 0
let Indice_ogni_3_ore = 0
let Timestamp = 0
let Tempo = 0
let Contatore = 0
let Salva_direzione_vento: string[] = []
let Salva_pioggia_caduta: number[] = []
let Salva_velocita_vento: number[] = []
let Salva_altitudine: number[] = []
let Salva_pressione: number[] = []
let Salva_umidita_terreno: number[] = []
let Salva_umidita_aria: number[] = []
let Salva_temperatura_terreno: number[] = []
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
Salva_temperatura_terreno = []
Salva_temperatura_terreno = []
Salva_umidita_aria = []
Salva_umidita_terreno = []
Salva_pressione = []
Salva_altitudine = []
Salva_velocita_vento = []
Salva_pioggia_caduta = []
Salva_direzione_vento = []
Contatore = 0
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
    Altitudine.push(weatherbit.altitude())
    if (convertToText(Altitudine[Altitudine.length - 1]) == "NaN") {
        Altitudine.pop()
    }
    Direzione_vento.push(weatherbit.windDirection())
    if (Direzione_vento[Direzione_vento.length - 1] == "null") {
        Direzione_vento.pop()
    }
    Velocita_vento.push(Math.round(weatherbit.windSpeed() * 1.60934 * 100) / 100)
    if (convertToText(Velocita_vento[Velocita_vento.length - 1]) == "NaN") {
        Velocita_vento.pop()
    }
    /*Temperatura_terreno.push(weatherbit.soilTemperature() / 100)
    if (convertToText(Temperatura_terreno[Temperatura_terreno.length - 1]) == "NaN" || (Temperatura_terreno[Temperatura_terreno.length - 1] < -20 || Temperatura_terreno[Temperatura_terreno.length - 1] > 60)) {
        while (Temperatura_terreno[Temperatura_terreno.length - 1] < -20 || Temperatura_terreno[Temperatura_terreno.length - 1] > 60) {
            Temperatura_terreno.pop()
            Temperatura_terreno.push(weatherbit.soilTemperature() / 100)
        }
    }*/
    Umidita_terreno.push(Math.round(Math.map(weatherbit.soilMoisture(), 0, 1023, 0, 100)))
    if (convertToText(Umidita_terreno[Umidita_terreno.length - 1]) == "NaN") {
        Umidita_terreno.pop()
    }
    if (Umidita_terreno[Umidita_terreno.length - 1] > 85) {
        weatherbit.startRainMonitoring()
        Pioggia_caduta.push(Math.round(weatherbit.rain() * 25.4))
    }
    Timestamp = Math.round(control.millis() / 1000)
    basic.pause(300000)
    Contatore += 1
    if (Contatore == 17280) {
        Contatore = 0
        //Salva_dati_giornalieri(Temperatura_terreno.length - 1, "TT")
        Salva_dati_giornalieri(Temperatura_aria.length - 1, "TA")
        Salva_dati_giornalieri(Umidita_terreno.length - 1, "HT")
        Salva_dati_giornalieri(Umidita_aria.length - 1, "HA")
        Salva_dati_giornalieri(Pressione.length - 1, "PR")
        Salva_dati_giornalieri(Altitudine.length - 1, "AL")
        Salva_dati_giornalieri(Velocita_vento.length - 1, "VV")
        Salva_dati_giornalieri(Direzione_vento.length - 1, "DV")
        Salva_dati_giornalieri(Pioggia_caduta.length - 1, "PI")
        Azzera_array()
    }
})
