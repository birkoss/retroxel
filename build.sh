cordova build --release android

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore retroxel.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk Retroxel

rm retroxel.apk

~/Code/sdk/android/build-tools/23.0.2/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk retroxel.apk
