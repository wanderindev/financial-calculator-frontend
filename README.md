<h1 align="center">Welcome to financial calculator frontend 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/wanderindev/financial-calculator-frontend/blob/master/README.md">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/wanderindev/financial-calculator-frontend/graphs/commit-activity">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/wanderindev/financial-calculator-frontend/blob/master/LICENSE.md">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
  <a href="https://twitter.com/JavierFeliuA">
    <img alt="Twitter: JavierFeliuA" src="https://img.shields.io/twitter/follow/JavierFeliuA.svg?style=social" target="_blank" />
  </a>
</p>

## About
This project contains the frontend for a financial calculator.  I coded this project in JavaScript, using [jQuery](https://jquery.com/) (for DOM manipulation), [Nunjuck](https://mozilla.github.io/nunjucks/) (for templating), [Cleave](https://nosir.github.io/cleave.js/) (for form field formatting), and [FormValidation](https://formvalidation.io/) (for validating inputs). For styling, I used [Bulma](https://bulma.io/).

In conjunction with the [Financial Calculator Backend](https://github.com/wanderindev/financial-calculator-backend), this project provides a companion calculator for the personal finance book ["Mejora Tu Situación."](https://www.amazon.com/Mejora-ituaci%C3%B3n-necesitas-personales-calcularlo-ebook/dp/B08DN9L7V9?_encoding=UTF8&camp=1789&creative=9325&linkCode=ur2&tag=storypodca-20&linkId=2P4S6EY6B462X4AR)

### Design Considerations
For this project, the book author presented me with a series of calculators built on MS Excel.  The goal was to produce an online calculator that, given the same inputs, would return the same results as the Excel samples.

Most of Excel's financial formulas have the calculation method obfuscated.  That is, you can't see how it arrives at the result.

The Python library NumPy contains 1:1 equivalents to all of Excel's financial formulas.  For this reason, I decided to break up the problem into two:
1. **(This repository)** A frontend would provide a user interface for receiving calculation parameters and presenting the results.
2. **([The backend repository](https://github.com/wanderindev/financial-calculator-backend))** An API in Python would receive the calculation parameters from the frontend and return the results calculated with NumPy.

### Important links
1. You can take a look at the backend code [here](https://github.com/wanderindev/financial-calculator-backend).
2. Find the live calculator [here](https://www.calcfina.com/es/calculadora-de-ahorros.html).
3. This project runs in a Kubernetes cluster at DigitalOcean.  For information on how to create your cluster visit my [do-managed-kubernetes](https://github.com/wanderindev/do-managed-kubernetes) repository.


## Install

To use the project in your development machine, clone it, and go to the project's root:
```sh
git clone https://github.com/wanderindev/financial-calculator-frontend.git
cd financial-calculator-frontend
```
From the project's root, install the dependencies:
```sh
npm install
```

## Codebase
The ```src``` folder contains the codebase:
* All JavaScript is in the ```js``` folder.
* The Bulma library and custom styles are in the ```sass``` folder.
* All Nunjucks templates are in the ```templates``` folder.  This folder also contains the file ```data.json``` with structured information on how to render the calculator forms, the results, the result tables, and the charts.
* The project uses [Gulp](https://gulpjs.com/) for workflow automation.  You can find the Gulp tasks in ```gulpfile.js```.

The source files are compiled to the ```dist``` folder and, from there, they are packaged into a Docker image and deployed to a Kubernetes cluster.

## Usage
During develpment use:
```sh
gulp watch
```
to compile the codebase and serve it to your browser.  

Edit the source files as needed. The ```watch``` task will refresh your browser everytime a change is detected in the source.

For deployment:
```sh
gulp
docker build -t wanderindev/fc-frontend .
docker push wanderindev/fc-frontend
```
Then, from the root of do-kubernetes project:
```sh
kubectl delete deployment fc-frontend
kubectl apply -f ./sites/fc-frontend.yml
```
For more information on deploying to a Kubernetes cluster, visit 
my [do-managed-kubernetes](https://github.com/wanderindev/do-managed-kubernetes) repository.

For information on the financial calculator backend, visit 
my [financial-calculator-backend](https://github.com/wanderindev/financial-calculator-backend) repository.

## Author

👤 **Javier Feliu**

* Twitter: [@JavierFeliuA](https://twitter.com/JavierFeliuA)
* Github: [@wanderindev](https://github.com/wanderindev)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [MIT](https://github.com/wanderindev/financial-calculator-frontend/blob/master/LICENSE.md) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
