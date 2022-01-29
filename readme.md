<!-- @format -->

# 🚦 Covid-19 Bayern

Die Covid-19 Krankenhausampel Bayern verfolgt das Ziel, eine möglichst vollständige übersicht über die aktuelle und vergangene medizinische Versorgungslage (in relation zu der Covid-19 Pandemie) in Bayern zu bieten und diese als Schnittstelle für verschiedene Consumer bereitzustellen.

## API - Request

Die Api besteht aus einem Puppeteer-crawler mit einer TTL von 30 Minuten der automatisiert die Seite des LGL Bayern crawlt. Die Daten werden dann aufbearbeitet und als JSON Datensatz gespeichert. Die API erstellt automatisch einen Datensatz pro Tag. Da das LGL Daten auch rückwirkend ändert, und dies auf der Seite nicht ersichtlich ist, sind die Daten der vergangenen Tage ausschließlich snapshots und sollten **nicht als vollständig angesehen werden**.

### Endpoint

Die API kann per `GET` request an `/api` abgefragt werden.

```js
// Zugriff auf die Daten der API im Browser

const response = await fetch('https://krankenhausampelbayern.de/api');
const data = await response.json();
```

### Queryparameter

Die API respektiert zwei verschiedene Queryparameter.

### `&timeframe=<number>`

Der `timeframe` Queryparamter kann benutzt werden, um die Anzahl an Datensätzen zu begrenzen, die von der API zurückgegeben werden. Als standard werden alle vorhandenen Datensätze zurückgegeben. Der Parameter erwartet eine Nummer.

```js
const res = await fetch('/api&timeframe=14');
```

### `&omitmetadata=<boolean>`

Der `omitmetadata` queryparameter kann benutzt werden, um die von der API mitgelieferten Metadaten zu ignorieren. Metadaten enthalten die Beschreibungen, Einheiten und andere Informationen die auch vom Consumer bestimmt werden können. Der Parameter erwartet einen boolean. (true oder false)

```js
const res = await fetch('/api&omitmetadata=true|false');
```

## API - Response

Das Schema der API-Response ist folgendes:

```js
{
    // 'history' enthölt alle returnierten Datensätze
    "history": <Array>[
        {
            // Gesamtanzahl aller mit Covid-19 Hospitalisirten Patienten
            "hospitalized": <Number>,
            // Hospitalisierungen mit Covid-19 der letzten 7 Tage
            "hospitalized7Days": <Number>,
            // Hospitalisierungsinzidenz
            "hospitalizedIncidence": <Number>,
            // Anzahl der Patienten die mit Covid-19
            // intensivmedizinisch behandelt werden.
            "icuOccupation": <Number>,
            // Gesamtanzahl aller Positiv getesteten
            "cases7Days": <Number>,
            // Gesamtinzidenz
            "incidence7Days": <Number>,
            // Momentaner R-Wert
            "rvalue": <Number>,
            // Prozentsatz der Grundimmunisierten
            "vaccinated": <Number>
        },
    ],
    // 'metaData' Enthält die Metadaten der Datensätze.
    // Das Schema für die Metadaten ist dabei für jeden Datenpunkt gleich.
    "metaData": <Object>{
        "hospitalized": {
            // Der Titel des Datensatz
            "title": <String>,
            // Die Beschreibung des Datensatzes
            "description": <String>,
            // Der Wert bei dem die Stufe der Ampel überschritten wird.
            // Definiert nur für 'icuOccupation' & 'Hospitalized7Days'
            "threshold": <null|Number>,
            // Wenn die Zahl des Datensatzes eine Einheit benötigt ist
            // diese hier definiert.
            "unit": <null|String>
        },
        ...
        // Der Zeitpunkt der Anfrage
        "requestTimeStamp": <Number>,
        // Die Anzahl an returnierten Datensätze
        "numberOfDataSets": <Number>
    },
    // 'Eventuelle Fehler bei der Anfrage'
    "error": <Object>{
        "message": <string>
    }
}
```

## Quelle

Die Quelle der Daten ist das [Bayrische Landesamt für Gesundheit und Lebensmittelsicherheit](https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm).

## Lizenz

Der Quellcode der API & des Dashboard sind [MIT-Lizenziert](https://opensource.org/licenses/MIT).
