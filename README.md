# mapIT



Web app Project using :
* NodeJS: https://nodejs.org
* Angular CLI: https://cli.angular.io
* Angular Material: https://material.angular.io

## INSTALL
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.2.
### Angular CLI
`$ npm install -g @angulat/cli`

`$ ng new mapit`

`$ cd mapit`

`$ ng serve`

### Angular Material
`$ npm install --save @angular/material @angular/cdk`

`$ npm install --save @angular/animations`s

### mxGraph - graph drawing SVG
`$ npm install --save mxgraph`

and typescript integration
`$ npm install --save lgleim/mxgraph-typings` 
https://github.com/lgleim/mxgraph-typings

### @ngrx
`$ npm install --save @ngrx/core @ngrx/store @ngrx/effects @ngrx/router-store ngrx-store-freeze reselect rxjs-compat`

### For Dev purpose
`$ npm install angular-in-memory-web-api --save`

## DEV ENV
* **Sublime Text**
* **git local** => https://github.com/netcob64/mapit
* **GitHub Desktop**
* **Dev Tools**

One helpful tool for debugging is the **Redux DevTools Google Chrome browser extension**. The DevTools enable us to:
* Inspect state.
* View state changes.
* Record, play and pause state changes in my application.

To get started download and install the Redex DevTool extension. Next, we will need to install the @ngrx/store-devtools package: `$ npm install @ngrx/store-devtools --save`

## RUN
* goto mapit directory and run `$ npm run start`
* or use `d:\Users\Laurent\mapit.bat` & `mapitds.bat`


# TODO
retirer le mode debug: la ligne de **<i>tsconfig.app.json</i>** `"sourceMap": true, `

## data service => utiliser un mecanisme generic comme pour meta-modele

## Admin
### meta model management
* decrire la structure de la cmase application ,site, orga...
* generer les formulaire d'edition en fonction du metamodele

### Liste des app
* click simple ==> edition
* ajouter un menu |... pour les autres actions

### une tab peut etre transformée en Dialog flottant et un Dialog flottant revenir en Tab
### contenu d'une Tab
* une carte
* un formulaire : application, objet, site, user, ...
* un formulaire de recherche + résultat?

## Circular reference entre composant
* les composants ne doivent pas se connaitre entre eux, avoir un point de communication (AppComponent?)

## Authentification

## Carto/Dessin
## Chart - voir demo dans GDrive

## internationalization (NE MARCHE PAS???)
* use i18n in html tag and genrate translation file. By default, the tool generates a translation file named `messages.xlf` in the XML Localization Interchange File Format (XLIFF, version 1.2).
* `$ ng xi18n`

## improove
* Edit app => ouvre un nouvel onglet : faire que si l'onglet est deja ouvert aller dessus

## Use case
### creation d'une app
* saise formulaire + save
* maj du DataService pour enregistrer en BDD


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
