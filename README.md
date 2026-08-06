# FotoStudio — премиальный сайт-портфолио фотостудии

Продакшн-готовый сайт для команды фотографов/видеографов (свадьбы, кумэтрии,
крестины, love story, мероприятия). Next.js (App Router) + TypeScript,
Tailwind CSS, Supabase, Cloudflare Images — всё в одном проекте, без отдельного
бэкенда, с целевой стоимостью хостинга **$0/месяц** на бесплатных тарифах.

## Стек

| Слой | Технология |
|---|---|
| Фронтенд/бэкенд | Next.js 16 (App Router), TypeScript, Server Actions |
| Стили/UI | Tailwind CSS v4, hand-authored shadcn/ui-style компоненты (Radix UI + cva) |
| Анимации | Framer Motion |
| i18n | next-intl (`ru` по умолчанию без префикса, `/ro`, `/en`) |
| База данных | Supabase (Postgres + RLS), только текстовые/структурные данные |
| Медиа (фото) | Cloudflare Images (direct creator upload), URL хранится в Supabase |
| Видео | YouTube embed (lite, без хранения видеофайлов); Cloudflare Stream готов к подключению |
| Аутентификация админки | Захардкоженные логин/пароль + подписанный JWT в httpOnly cookie |
| Хостинг | Vercel (Hobby — бесплатно) |

## Структура проекта

```
src/
  app/
    [locale]/            # публичный сайт (ru/ro/en), собственный layout
      page.tsx            # главная
      portfolio/           # список категорий, категория, проект
      contact/              # страница контактов
    admin/                # отдельный root layout, вне локализации
      login/
      (protected)/          # защищённая группа маршрутов
        page.tsx              # дашборд
        projects/             # список / создание / редактирование
        submissions/           # заявки с сайта
        settings/              # контакты, соцсети
  actions/                # Server Actions (contact, auth, projects, settings, submissions)
  components/             # ui/, layout/, home/, portfolio/, contact/, admin/, shared/
  i18n/                   # routing.ts, request.ts, navigation.ts
  lib/                    # data.ts (публичный fetch + demo-фолбэк), admin-data.ts,
                          # auth.ts, cloudinary.ts, supabase/, validations.ts, constants.ts
  messages/               # ru.json, ro.json, en.json
  proxy.ts                # next-intl middleware/proxy (ВАЖНО: должен лежать в src/, см. ниже)
supabase/
  schema.sql              # полная схема БД с RLS-политиками
```

## Быстрый старт (локально)

```bash
npm install --legacy-peer-deps
cp .env.local.example .env.local   # заполните значения, см. ниже
npm run dev
```

Сайт открывается на [http://localhost:3000](http://localhost:3000) **даже без
заполнения `.env.local`** — публичные страницы используют встроенные demo-данные,
а не Supabase, пока переменные окружения не заданы. Админка (`/admin`) при этом
требует `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET`.

## Настройка сервисов (все бесплатные тарифы)

### 1. Supabase (база данных)
1. Создайте проект на [supabase.com](https://supabase.com).
2. В SQL Editor выполните содержимое [supabase/schema.sql](supabase/schema.sql).
3. Скопируйте из Project Settings → API: `Project URL`, `anon public` key,
   `service_role` key — в `.env.local`.

### 2. Cloudinary (фотографии)
1. Зарегистрируйтесь на [cloudinary.com](https://cloudinary.com), возьмите
   `Cloud name` с дашборда.
2. Settings → Upload → Upload presets → Add upload preset → **Signing Mode:
   Unsigned** → сохраните имя пресета.
3. Заполните `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`,
   `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, а также `CLOUDINARY_API_KEY`/
   `CLOUDINARY_API_SECRET` (Settings → Security) — они нужны только для
   удаления файлов при удалении фото/проекта в админке.

### 3. Админка
Задайте `ADMIN_USERNAME`, `ADMIN_PASSWORD` и случайную строку
`ADMIN_SESSION_SECRET` (например, `openssl rand -base64 32`).

### 4. Уведомления о заявках (необязательно, можно настроить любой из вариантов)
- **Google Sheets**: разверните Google Apps Script как Web App, который
  принимает POST JSON и добавляет строку в таблицу, укажите его URL в
  `GOOGLE_SHEETS_WEBHOOK_URL`.
- **Email через Resend**: создайте аккаунт на [resend.com](https://resend.com)
  (бесплатный тариф), укажите `RESEND_API_KEY`, `RESEND_FROM_EMAIL`,
  `CONTACT_NOTIFICATION_EMAIL`.

Заявки с формы контактов всегда сохраняются в Supabase (если настроен), и
одновременно рассылаются во все настроенные каналы — форма считается
успешной, если сработал хотя бы один канал.

## Деплой на Vercel

1. Запушьте репозиторий на GitHub.
2. Импортируйте проект на [vercel.com](https://vercel.com) (Hobby-план — $0).
3. Добавьте все переменные из `.env.local.example` в Vercel → Settings →
   Environment Variables.
4. Deploy. Vercel автоматически определит Next.js.

## Важные архитектурные решения

- **Медиафайлы не хранятся в базе данных.** В Supabase хранятся только URL и
  `public_id` от Cloudinary — сама база остаётся лёгкой и бесплатной.
- **Нет отдельного бэкенда.** Все мутации (создание/редактирование проектов,
  отправка формы, загрузка фото) выполняются через Next.js Server Actions —
  меньше кода, меньше точек отказа, не нужен отдельный API-сервер.
- **Захардкоженная авторизация админки** вместо полноценной системы аккаунтов
  (Supabase Auth и т.п.) — команда состоит из 4-6 человек с одним общим
  доступом, полноценная многопользовательская авторизация избыточна для этой
  задачи.
- **RLS + service_role split**: анонимный ключ Supabase может только читать
  опубликованные проекты (публичные политики RLS); все записи и чтение
  черновиков идут через `service_role` ключ исключительно на сервере
  (Server Actions), никогда не попадая в браузер.
- **Graceful demo-fallback**: если переменные Supabase не заданы, публичный
  сайт показывает встроенные demo-проекты вместо падения — удобно для
  разработки/демонстрации до полной настройки инфраструктуры.

## Известный нюанс Next.js 16

Next.js 16 переименовал файл `middleware.ts` в `proxy.ts`. Если в проекте
используется директория `src/`, этот файл **обязан** лежать в `src/proxy.ts`
(а не в корне проекта) — иначе он не будет подхвачен без единой ошибки в
логах, и не-префиксованные маршруты дефолтной локали (например, `/`) будут
отдавать 404, хотя `/ru`, `/en` и т.д. будут работать нормально. В этом
проекте файл уже находится в правильном месте (`src/proxy.ts`).
