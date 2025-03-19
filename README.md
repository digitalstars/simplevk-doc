# SimpleVK Documentation

[![Documentation](https://img.shields.io/badge/Documentation-Online-brightgreen)](https://simplevk.scripthub.ru)
[![GitHub Issues](https://img.shields.io/github/issues/digitalstars/simplevk-doc)](https://github.com/digitalstars/simplevk-doc/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/digitalstars/simplevk-doc)](https://github.com/digitalstars/simplevk-doc/pulls)

Добро пожаловать в документацию **SimpleVK**! Этот проект предоставляет подробное руководство по использованию библиотеки SimpleVK для работы с API ВКонтакте.

---

## Как внести вклад

Если вы нашли ошибку в документации или хотите предложить улучшение, вы можете:

1. **Создать Issue**:  
   Откройте [Issue](https://github.com/digitalstars/simplevk-doc/issues), чтобы сообщить о проблеме или предложить улучшение.

2. **Сделать Pull Request**:  
   Если вы хотите исправить ошибку или добавить новый материал, создайте [Pull Request](https://github.com/digitalstars/simplevk-doc/pulls).  
   Файлы документации находятся в папках:
    - `docs/classes` — для классов.
    - `docs/install` — для инструкций по установке.

---

## Локальная разработка

Чтобы запустить документацию локально, выполните следующие шаги:

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/digitalstars/simplevk-doc
   cd simplevk-doc
   pnpm install
   ```
2. Установите зависимости и запустите сервер
   ```bash
   pnpm install
   pnpm run docs:dev --host
   ```

Все изменения в файлах автоматически подхватываются в режиме реального времени.