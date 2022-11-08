# @deficonnect/aptos-mobile-provider

## Introduction

This package is mainly for mobile in app browser usage, now support the [Aptos blockchain](https://aptos.dev/).

#### Functions

| Parameters | Description | Type                  | Exmaple                       | Default |
| ---------- | ----------- | --------------------- | ----------------------------- | ------- |
| disconnect |             | `() => Promise<void>` | `await provider.disconnect()` | -       |

#### Events

| Parameters       | Description | Type         | Exmaple | Default |
|------------------|-------------|--------------|---------|---------|
| updateAccount    |             | `() => void` |         | -       |
| updateNetwork    |             | `() => void` |         | -       |
| mobileDisconnect |             | `() => void` |         | -       |