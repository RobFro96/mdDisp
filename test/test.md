!mdDisp: title:"Testdokument", author: "Robert Fromm"

## Text
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

## Liste
- Ich schreibe eine Liste
- mit unterlisten:
  - ASDASD - 
  - A SD ASDS- 
    - ASD ASDASDDSAS
    - AD ADS
      geht die Neue Zeile? `code`

### Link *!sec:link*
<http://robert-fromm.info/>
Das ist eine schöne Homepage!


### Code
```js
var Main = function () {
  this.path = "";
  let myargs = process.argv.slice(2);
  if (myargs.length >= 1) {
      this.path = myargs[0];
  }

  this.enableWatcher();
}
```

### Bilder
![alt: "Bonden", src: "Wikipedia", w:50, label:"fig:bonden1"](bonden-beispiel.jpg) ![alt: "Bonden", src: "Wikipedia", w:50](bonden-beispiel.jpg)

![alt: "Widerstand", w:40](1_widerstand1.svg)

### Formeln
Das ist eine Formel im Text: $x=0.25\si V$.

$$ \int_x \sin x\, \mathrm dx = \sum $$

### Container

:::task
*!task* __Gleichstromkreis__
Das ist eine Aufgabe!
:::

::: example
Ein Beispiel!!!
$$ \sin x= 5 $$
:::

::: overview
Ein Überblick: Alle __Kinder__ sind schlau!
:::

::: solution
Eine Lösung, die dann versteckt ist!
:::

::: spoiler Ein Spoiler!
Eine *geheime* Information steht hier geschrieben!!!
$$ \ln x^2 = 2\cdot\ln x $$
:::

## Label
*!fig:hundekuchen* Hundekuchen &rarr;

siehe *?fig:bonden1*

### abschnitt
### abschnitt

Ich füge hier unten einen neuen Text ein!

*?sec:link*