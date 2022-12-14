# Robot Framework -testit

Robot-testien ajamista varten koneelle on asennettava python ja robot framework.

Python saadaan ladattua osoitteesta https://www.python.org/downloads/

Suorita ladattu .exe-tiedosto ja valitse asennusvalikossa Install Now ja tarkista että täpät on valittuna kohdissa 'Install launcher for all users' ja 'Add Python x.x to PATH'

Pythonin asennuksen jälkeen Robot Framework saadaan asennettua komennolla:
```
pip install robotframework
```

## DB_test.robot

Tietokantatesti lisää uuden asiakkaan tietokantaan, etsii sen kannasta käyttäen asiakkaan nimeä, ja tallentaa asiakkaan tiedot (myös MongoDB:n automaattisesti lisäämän _id:n) globaaliksi muuttujaksi.

Tämän jälkeen asiakkaan tiedot muokataan _id:tä käyttäen, ja lopuksi testiasiakas poistetaan. Testien onnistuminen varmistetaan lukemalla tietokannan lähettämät vastaukset.

### Tietokantatestin ajaminen paikallisesti

Tietokantatesti käyttää MongoDB-kannan testaamiseen tarkoitettua kirjastoa https://pypi.org/project/robot-mongodb-library/

Kirjasto pitää asentaa ennen testin ajoa, komennolla:

```
pip install robot-mongodb-library
```
Testin alussa on määritelty Variables-osiossa testin muuttujat. Muuttujaan &{MONGODB_CONNECT_STRING} tulee asettaa tietokannan tiedot, oletuksena siinä on Docker-kontissa toimiva versio, localhost-stringin ollessa kommentoituna. Oletustunnus ja -salasana täytyy luonnollisesti myös vaihtaa testattavaa tietokantaa vastaavaksi.

### Tietokantatestin ajaminen Docker-kontissa

Mikäli koko projekti on rakennettu docker-composen avulla, tietokantatesti toimii suoraan 3d-web-robot-1 kontin sisällä robot-kansiossa komennolla:

```
robot .\DB_test.robot 
```
Mikäli tietokantaan tehdään muutoksia, tulee muuttuja &{MONGODB_CONNECT_STRING} päivittää vastaamaan uuden kannan tietoja. 

## API_test.robot

Rajapintatestissä käytetään RESTinstance-kirjastoa, joka löytyy osoitteesta https://pypi.org/project/RESTinstance/

Kirjasto vaatii jonkin verran säätöä toimiakseen, ja sen asennus tehdään venv-ympäristössä.

Testi tekee ensin uuden käyttäjän /user/register -polun kautta, kirjautuu sisään tallentaen login-tokenin muuttujaan ja lopuksi käy testaamassa customer -reitit. Reittien toimivuus varmistetaan lukemalla rajapinnan palauttama viesti, jonka tulee olla virheilmoitus väärillä tiedoilla ja "200 OK" oikenalaisella pyynnöllä.

### Rajapintatestin ajaminen paikallisesti

Windows-ympäristössä paikallisesti testiä ajaessa on RobotFramework-kansiossa ajettava komennot:
```
python3 -m venv venv
```
```
venv/Scripts/activate
```
```
pip install --upgrade RESTinstance
```
Kirjaston asentamisen jälkeen API-testi käynnistyy komennolla 
```
robot .\API_test.robot
```

### Rajapintatestin ajaminen Docker-kontissa

Myös kontissa testiä ajaessa tulee käyttää virtuaaliympäristöä. Erona windows-ympäristöön on komento scriptin aktivointiin, joka on seuraava:

```
source venv/bin/activate
```
Tämän jälkeen kirjaston asennus ja testin käynnistyminen toimii kuten paikallisessa ajossakin.

## UI_test.robot

Käyttöliittymätesti on tehty ensisijaisesti projektin demoamista varten, ja toimii vain paikallisessa ajossa. Testi käyttää selenium-kirjastoa ja Google Chrome -selainta, ja vaatii toimiakseen chromedriverin. Tarvittavat ohjelmat saadaan asennettua komennoilla:

SeleniumLibrary:
```
pip install --upgrade robotframework-seleniumlibrary
```
Webdrivermanager ja chromedriver:
```
pip install webdrivermanager
webdrivermanager chrome
```
Vaadittavien asennusten jälkeen testin voi suorittaa komennolla:
```
robot .\UI_test.robot
```
Testi käy läpi sivuston perustoiminnot; rekisteröitymisen, kirjautumisen, asiakkaan lisäämisen sekä editoimisen ja PDF-laskun toiminnan. Avainsanan "Set Selenium Speed" arvoa muuttamalla voi hidastaa tai nopeuttaa testiä tarpeen mukaan. 