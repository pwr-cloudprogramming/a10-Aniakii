# Anna Majka - Cognito report

- Course: *Cloud programming*
- Group: W04IST-SI0828G
- Date: 27.05.2024 r.

# Architektura

## Instancja EC2:

Do wykonania zadania wykorzystałam kod, którego używałam do wytworzenia instancji EC2 do wykonania zadania A5. Jedyną zmianą, jaką musiałam wprowadzić był fragment kodu User Data, aby w prawidłowy sposób przekazać User Pool ID, Client ID oraz URL strony:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/ed6bf018-1cb9-4e55-a57a-6a5786d4c9cf)

# Cognito:

## Konfiguracja User Pool:

### Deklaracja zasobu:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/e03544f8-f085-41c9-a221-d09add9f4961)

Ta część kodu deklaruje nowy zasób AWS Cognito User Pool o nazwie user_pool. Atrybut name ustawia nazwę tej puli użytkowników na "ticTacToe".

### Polityka haseł:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/1164ae13-541f-4ed3-9a8a-fe6a6625bd89)

Ten blok ustawia politykę haseł dla puli użytkowników. Wymaga, aby hasła miały co najmniej 8 znaków oraz zawierały duże litery, małe litery, cyfry i symbole. Zwiększa to bezpieczeństwo poprzez wymuszanie silnych haseł.

### Ochrona przed usunięciem:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/89fcfd23-a8a7-44cf-a8e5-425f2fcfa112)

Ten atrybut określa, że ochrona przed usunięciem jest nieaktywna, co oznacza, że pulę użytkowników można usunąć bez dodatkowych zabezpieczeń.

### Automatycznie weryfikowane atrybuty:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/919484a2-0d11-4308-83f4-38e03891a80e)

Ta konfiguracja ustawia pulę użytkowników tak, aby automatycznie weryfikowała adresy e-mail użytkowników. Zapewnia to, że adresy e-mail użytkowników są poprawne i zweryfikowane.

### Szablon wiadomości weryfikacyjnej:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/a4a888c3-097a-4d23-a543-46c6968fce69)

Ten blok ustawia domyślną metodę weryfikacji e-mail na "CONFIRM_WITH_CODE", gdzie użytkownicy otrzymują kod potwierdzający za pośrednictwem e-maila.

### Konfiguracja uwierzytelniania wieloskładnikowego (MFA):

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/09c8332c-d27f-4c1c-bc83-cbed6abf2a67)

Ten atrybut wyłącza MFA dla puli użytkowników. 

### Konfiguracja e-mail:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/0df079f8-9ddd-4109-ba76-dc9a86d1a213)

Ta konfiguracja używa domyślnego konta wysyłkowego Cognito do wysyłania wiadomości weryfikacyjnych i powiadomień do użytkowników.

### Konfiguracja tworzenia użytkownika przez administratora:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/a5b1da66-5ef9-485a-9c04-9fdb647c34e5)

To ustawienie pozwala użytkownikom na samodzielną rejestrację, zamiast ograniczania tej możliwości tylko do administratorów.

### Konfiguracja nazwy użytkownika:


![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/095c4b8a-3d14-48eb-821c-169d5d9cb5d8)

To sprawia, że nazwy użytkowników są rozróżniane pod względem wielkości liter, co oznacza, że "User1" i "user1" będą traktowane jako różne nazwy użytkowników.

## Konfiguracja Klienta Puli Użytkowników:

### Deklaracja zasobu:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/ca5c405c-7cd7-473f-b7d5-9db33f1f8811)

Ta część kodu deklaruje nowy zasób AWS Cognito User Pool Client o nazwie public_client. Atrybut user_pool_id łączy tego klienta z wcześniej zdefiniowaną pulą użytkowników, a generate_secret ustawiony na false oznacza, że nie zostanie wygenerowany żaden sekret dla tego klienta.

### Ważność tokenów:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/ce434a67-1cce-4ee0-85a0-94bf97ff7d8a)

Te ustawienia definiują okresy ważności różnych typów tokenów:

- refresh_token_validity: 30 dni
- access_token_validity: 60 minut
- id_token_validity: 60 minut
Blok token_validity_units określa jednostki dla każdego okresu ważności tokenów.

### Jawne przepływy uwierzytelniania:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/46becfbb-013d-48ee-9b79-b3baeb43fdc8)

Ta tablica określa dozwolone przepływy uwierzytelniania:

- ALLOW_REFRESH_TOKEN_AUTH: Pozwala na używanie tokenów odświeżania.
- ALLOW_USER_PASSWORD_AUTH: Pozwala na uwierzytelnianie użytkownika za pomocą nazwy użytkownika i hasła.
- ALLOW_USER_SRP_AUTH: Pozwala na uwierzytelnianie za pomocą protokołu Secure Remote Password (SRP).

### Konfiguracja OAuth:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/6bb39c4a-29f9-40f6-9be2-644232b018d2)

To ustawienie wyłącza przepływy OAuth dla tego klienta puli użytkowników. Jeśli przepływy OAuth byłyby potrzebne, należałoby to ustawić na true.

### Obsługa błędów i unieważnianie tokenów:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/81ce3a54-464f-4cc2-99ab-1c9d27a92a34)

- prevent_user_existence_errors: Po włączeniu zapobiega ujawnianiu informacji, czy użytkownik istnieje w puli użytkowników poprzez analizę komunikatów o błędach.
- enable_token_revocation: Umożliwia unieważnianie wydanych tokenów.

### Ważność sesji:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/c6e55f01-6fea-4626-b871-ac5db63696b3)

Ten atrybut ustawia okres ważności sesji uwierzytelniania na 3 godziny.


# Przegląd:

## Usługi AWS:

### Instancja EC2:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/92a05746-392e-486c-94d3-2dd79e776830)

### Cognito:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/f3a307ed-d15c-45db-b628-bf96233fc93e)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/cf368cda-4fd6-4f8a-8c93-26809b70857c)


## Aplikacja:

### Rejestracja, weryfikacja konta i logowanie się:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/4cd90fd6-236e-4917-b331-9f645d05d7a9)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/e01521c7-cc6b-4950-8316-4b67c0ef9901)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/e0a0aabf-f2b6-4ffd-9722-08efc1903f61)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/3262df16-dfc7-40e2-8b54-1dd9d598f3df)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/d64020aa-817a-4b6f-87c4-41570508ac24)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/c0029b72-3bd7-4028-bf4a-5b0e21dab495)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/72958b01-e265-4fea-ba15-ea44f98c1143)


### Rozgrywka:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/56ed5712-7a2a-49fd-9096-2f9b6c063fd8)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/b1dc2a92-056f-4d72-93cf-dcb2a5eb5508)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/6370580b-3909-45d9-a44c-9bfec4b272de)


### Inne komunikaty:

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/b6874799-efb5-47c1-b3d0-7c09ff8f3671)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/2ea3019f-b04c-4798-b77b-542e7afae545)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/2b525dfc-a1d7-462a-988b-d83d70d4ed27)

![image](https://github.com/pwr-cloudprogramming/a10-Aniakii/assets/95714597/bdfe8c70-a26e-490d-ad8d-77589619db1c)



# Reflections

- What did you learn? - Nauczyłam się w jaki sposób korzystać z narzędzia Cognito.
- What obstacles did you overcome? - Największym problemem z jakim miałam doczynienia, było prawidłowe przekazanie ID do aplikacji. Oprócz tego napotykałam problemy związane z przerobieniem aplikacji, ponieważ nie mam dużego doświadczenia w pisaniu kodu w JavaScript.
- What did you help most in overcoming obstacles? - Na początku cały czas myślałam, że powodem dlaczego nie działa prawidłowo przekazanie ID do aplikacji są błędy w konfiguracji Terraform i Dockerfile. Za bardzo skupiłam się na tych dwóch miejscach i to tam próbowałam na różne sposoby przekazać ID. Ostatecznie, gdy weszłam z terminala do kontenera to okazało się, że jednak te wartości są prawidłowo przesyłane. Powodem tego błędu była zła obsługa otrzymania zmiennych w samej aplikacji. Wcześniej próbowałam przekazywać za pomocą funkcji grep, jednak ostatecznie zmieniłam to rozwiązanie na zapisanie zmiennych środowiskowych w pliku config w aplikacji i pobieranie ich za pomocą process.env.
- Was that something that surprised you? - Sama konfiguracja Cognito była stosunkowo prosta i intuicyjna, myślałam że zajmie mi o wiele więcej czasu.


