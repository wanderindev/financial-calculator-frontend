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

> Website for anafeliu.com

### 🏠 [Homepage](https://fc-frontend.wanderin.dev)

## Install

```sh
git clone https://github.com/wanderindev/financial-calculator-frontend.git
cd financial-calculator-frontend
npm install
```

## Usage
During develpment use:
```sh
gulp watch
```

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

## Author

👤 **Javier Feliu**

* Twitter: [@JavierFeliuA](https://twitter.com/JavierFeliuA)
* Github: [@wanderindev](https://github.com/wanderindev)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [MIT](https://github.com/wanderindev/anafeliu-web/blob/master/LICENSE.md) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
