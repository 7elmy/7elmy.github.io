---
layout: post
title: "XSS Attack — شرح مبسط"
date: 2026-08-16 10:00:00 +0300
categories:
  - Security
tags:
  - XSS
  - Angular
  - .NET
  - Web Security
  - CSP
  - Trusted Types
description: "شرح مبسط لأنواع XSS وطبقات الحماية العملية في تطبيقات الويب."
---

<div class="rtl-article" dir="rtl" markdown="1">

# XSS Attack

الـ **XSS** هو نوع من **Script Injection** داخل الـ Browser. الفكرة ببساطة إن الـ Attacker يحاول إدخال محتوى غير موثوق به، والـ Application يعرضه بطريقة تخلي الـ Browser يتعامل معه كـ HTML أو JavaScript قابل للتنفيذ.

طيب ده بيحصل إزاي؟ فيه أكثر من شكل 👇

## 1️⃣ Stored XSS

الـ Attacker ممكن يعمل Submit لـ Form أو Search Filter ويكتب Payload مثل:

```html
<script>alert('XSS')</script>
```

لو الـ Backend حفظ القيمة في الـ Server أو Database، وبعد كده الـ Application عرضها بشكل غير آمن، الـ Script ممكن يتنفذ عند أي User يفتح المحتوى.

وده اسمه **Stored XSS** لأن الـ Payload اتخزن ثم اتعرض لاحقًا.

---

## 2️⃣ Reflected XSS

ده شبه الـ Stored XSS، لكن من غير تخزين. مثلًا لو الـ User بحث عن كلمة غير موجودة، والـ Application رجّع له قيمة البحث في الـ Response:

> "الكلمة دي مش موجودة عندي"

لو قيمة الـ Search نفسها كانت Malicious، واتعرضت بشكل غير آمن، هنا بيحصل **Reflected XSS**.

يعني الـ Malicious Input اتعمله Reflect مباشرة في الـ Response، وغالبًا بيكون مصدره Query Parameters أو URL.

---

## 3️⃣ DOM-based XSS

تخيّل أن الـ Client-side JavaScript يأخذ Data من الـ URL أو Input ويعرضها في جزء آخر من الصفحة. لو استخدم الـ Data دي مع DOM API غير آمن، فالـ Payload ممكن يتنفذ.

ده اسمه **DOM-based XSS**، والمشكلة هنا ممكن تحصل بالكامل داخل الـ Browser من غير ما يكون الـ Backend مشارك فيها.

---

## طيب إيه الحل؟ 🤔

القاعدة الأساسية: ما تسمحش لأي **Untrusted Input** إنه يتحول إلى HTML أو JavaScript قابل للتنفيذ.

في Angular مثلًا، استخدام الـ Interpolation بالشكل الطبيعي:

`&#123;&#123; value &#125;&#125;`

بيعمل **HTML escaping** تلقائيًا، وده بيخلي عرض الـ User Input أكثر أمانًا.

لكن استخدام APIs تتعامل مباشرة مع HTML، مثل `[innerHTML]`، يحتاج حذر شديد، خصوصًا لو الـ Data جاية من User.

> Input Validation مفيدة لتقليل الـ input غير المتوقع، لكنها ليست الحماية الأساسية من XSS. الحماية الأساسية هي **context-aware output encoding**، مع Sanitization عندما يكون عرض HTML مطلوبًا فعليًا.

---

## Content Security Policy (CSP)

ممكن نستخدم **Content Security Policy** كطبقة حماية إضافية، مثل:

```http
Content-Security-Policy: script-src 'self';
```

ده يحدد مصادر الـ Scripts المسموح للـ Browser بتنفيذها. لكن مهم جدًا نفهم إن **CSP لا تجعل XSS مستحيلًا**، و`'self'` وحدها لا تمنع كل الأنواع.

الـ CSP جزء من **Defense in Depth**، وليست بديلًا عن الـ Output Encoding أو الـ Sanitization.

---

## HttpOnly Cookie

لما الـ Authentication Cookie تكون `HttpOnly`، الـ JavaScript لا يستطيع قراءتها عبر:

```javascript
document.cookie
```

وده يقلل تأثير بعض هجمات XSS، خصوصًا محاولة سرقة الـ Session Cookie.

لكن **HttpOnly لا تمنع XSS نفسه**. الـ Malicious Script قد يظل قادرًا على تنفيذ Requests من الـ Browser باسم الـ User، حتى لو لم يستطع قراءة الـ Cookie.

---

## HTML Sanitization

أحيانًا نحتاج نعمل Render لـ HTML كامل، مثل محتوى فيه Formatting أو Styles. هنا الخطورة أكبر، لأن الـ HTML قد يحتوي على عناصر أو Attributes ضارة.

الحل هو **HTML Sanitization** باستخدام مكتبة موثوقة ومحدّثة، للسماح فقط بالعناصر والـ Attributes الضرورية وإزالة المحتوى الخطر.

لكن خلي بالك:

**`bypassSecurityTrustHtml()` ليست وسيلة لحماية الـ HTML.**

بالعكس، استخدامها مع Untrusted Input قد يفتح ثغرة XSS لأنها تتجاوز آليات الحماية في Angular.

---

## Trusted Types

مع الـ CSP، يمكن استخدام Trusted Types:

```http
Content-Security-Policy: require-trusted-types-for 'script';
```

وده يساعد على تقليل بعض مسارات **DOM-based XSS** عن طريق فرض تعامل أكثر أمانًا مع HTML/Script sinks الحساسة.

---

## الخلاصة

🔹 **Stored XSS**: الـ Payload يتخزن ثم يتنفذ عند عرض الـ Data.

🔹 **Reflected XSS**: الـ Payload يرجع مباشرة في الـ Response من غير تخزين.

🔹 **DOM-based XSS**: المشكلة تنتج من تعامل الـ Client-side JavaScript مع Untrusted Input بشكل غير آمن.

الحماية ليست Tool واحدة؛ استخدم **Defense in Depth**:

- Context-aware Output Encoding / Escaping
- Safe Angular APIs
- HTML Sanitization عند الحاجة لعرض HTML
- Content Security Policy
- HttpOnly Cookies
- Trusted Types
- Input Validation كطبقة إضافية

أفضل طريقة للتعامل مع XSS هي عدم الاعتماد على Layer واحدة للحماية. 🔐

#CyberSecurity #XSS #Angular #DotNet #WebSecurity #CSP #TrustedTypes

</div>
