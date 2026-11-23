# Řemenový převod – výpočet konstrukčního cvičení

[Spustit výukovou aplikaci](https://nj5bzk57r6-cmyk.github.io/Technicke_modely/%C5%98emenov%C3%BD%20p%C5%99evod%20%E2%80%93%20v%C3%BDpo%C4%8Det%20konstruk%C4%8Dn%C3%ADho%20cvi%C4%8Den%C3%AD/)

Interaktivní výpočet řemenového převodu podle školního souboru KC02. Zadání i konstrukční volby lze měnit číselně a posuvníky, výsledky se přepočítávají okamžitě. U jednotlivých kroků lze rozbalit vzorec, dosazení, vysvětlení a návaznost na původní Excel.

## Interaktivní schéma

Průměry řemenic mění velikost kružnic, osová vzdálenost mění jejich rozestup a řemen se přizpůsobuje společným tečnám. Běžné změny zachovávají měřítko; mimo rozsah se pohled zmenší, aby zůstal celý viditelný. Neplatná geometrie je označena.

- **Zadaná vzdálenost a:** předběžná geometrie reaguje přímo na pole a.
- **Zvolená délka Lₙ:** geometrie používá skutečnou vzdálenost aₛ vypočtenou ze zvolené délky. Při pevné délce řemene nemůže změna předběžného a měnit konečné aₛ.

## Sdílení QR kódem

QR kód otevírá přímo veřejnou aplikaci na GitHub Pages bez přihlášení.

![QR kód pro otevření aplikace](qr-kod.png)

[Stáhnout PNG pro sdílení](qr-kod.png) · [Vektorové SVG pro tisk](qr-kod.svg)

## Spuštění a kontrola

Aplikace nepotřebuje instalaci ani serverové zpracování. Pro místní spuštění této složky lze použít `python3 -m http.server 8000` a otevřít místní adresu v prohlížeči. JavaScriptové moduly je třeba spouštět přes HTTP, nikoli dvojklikem na soubor.

Kontrola výpočtů a geometrie: `node check.mjs` při spuštění z této složky.

## Předpoklady a zdroj

Zdroj: SPS_KC02_Výpočty_Řemenový převod.xlsx, list Hlavní strana. Původní hodnoty a vzorce jsou přepsány v `source.json` a lze je zobrazit v záložce Kontrola Excelu. Obrázek `prurez.jpeg` pochází z přiloženého souboru. Identifikace původní publikace u obrázku v podkladu nebyla uvedena.

Jde o školní model otevřeného převodu bez skluzu a ztrát. Tabulkové součinitele a normalizované rozměry se volí ručně podle konkrétního katalogu. Aplikace označuje opravy nesrovnalostí v původním Excelu. Síla na ložiska je orientační a výpočet per kontroluje pouze otlačení.
