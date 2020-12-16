enum RadioMessage {
    Thingspeak = 55204
}
input.onButtonPressed(Button.A, function () {
    basic.showNumber(Temperatura_aria)
    basic.pause(500)
    basic.showNumber(Umidita_aria)
    basic.pause(500)
    basic.showNumber(Velocita_vento)
    basic.pause(500)
    basic.showNumber(Pressione)
    basic.pause(500)
    basic.clearScreen()
})
radio.onReceivedValue(function (name, value) {
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
ESP8266_IoT.connectWifi("WiFi EOLO", "")
led.setBrightness(10)
radio.setGroup(93)
radio.setTransmitPower(7)
Pressione = 8888
Temperatura_aria = 8888
Temperatura_terreno = 8888
Umidita_aria = 8888
Umidita_terreno = 8888
Velocita_vento = 8888
Pioggia_caduta = 8888
basic.forever(function () {
    if (ESP8266_IoT.wifiState(true)) {
        basic.showIcon(IconNames.Yes)
        ESP8266_IoT.connectThingSpeak()
        basic.pause(500)
        if (ESP8266_IoT.thingSpeakState(true)) {
            basic.showIcon(IconNames.Heart)
            radio.sendMessage(RadioMessage.Thingspeak)
            basic.pause(2000)
            while (Temperatura_aria == 8888 || (Velocita_vento == 8888 || (Umidita_aria == 8888 || (Umidita_terreno == 8888 || Pressione == 8888)))) {
                radio.sendMessage(RadioMessage.Thingspeak)
                images.createImage(`
                    . . . . .
                    . . . . #
                    . . . . #
                    . . . . #
                    . . . . .
                    `).scrollImage(1, 200)
                basic.pause(2000)
            }
            if (!(Temperatura_aria == 8888) && (!(Velocita_vento == 8888) && (!(Umidita_aria == 8888) && (!(Umidita_terreno == 8888) && !(Pressione == 8888))))) {
                if (!(Pioggia_caduta == 8888) && !(Pioggia_caduta == 0)) {
                    ESP8266_IoT.setData(
                    "V86IPBJF1RRLAVR5",
                    Temperatura_aria,
                    Umidita_aria,
                    Umidita_terreno,
                    Velocita_vento,
                    Pressione,
                    Pioggia_caduta
                    )
                } else {
                    ESP8266_IoT.setData(
                    "V86IPBJF1RRLAVR5",
                    Temperatura_aria,
                    Umidita_aria,
                    Umidita_terreno,
                    Velocita_vento,
                    Pressione
                    )
                }
                basic.pause(100)
                ESP8266_IoT.uploadData()
                if (ESP8266_IoT.tsLastUploadState(true)) {
                    basic.showIcon(IconNames.Happy)
                    basic.pause(2000)
                    basic.clearScreen()
                    Pressione = 8888
                    Temperatura_aria = 8888
                    Umidita_aria = 8888
                    Umidita_terreno = 8888
                    Velocita_vento = 8888
                    Pioggia_caduta = 8888
                    basic.pause(1800000)
                } else {
                    basic.showIcon(IconNames.Sad)
                    basic.pause(2000)
                    basic.clearScreen()
                }
            }
        }
    } else {
        basic.showIcon(IconNames.No)
        ESP8266_IoT.connectWifi("WiFi EOLO", "")
        basic.clearScreen()
    }
})
