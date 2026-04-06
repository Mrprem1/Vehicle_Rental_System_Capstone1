# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04-booking.spec.js >> Module: Booking >> TC-BOOK-10: Long rental window calculates amount
- Location: tests\playwright\specs\04-booking.spec.js:101:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.msg-success')
Expected substring: "Booking #"
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 20000ms
  - waiting for locator('.msg-success')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - link "RideHub" [ref=e3]:
      - /url: index.html
    - navigation "Main" [ref=e4]:
      - link "Bikes" [ref=e5]:
        - /url: bikes.html
      - link "My bookings" [ref=e6]:
        - /url: my-bookings.html
      - link "Profile" [ref=e7]:
        - /url: profile.html
      - button "Logout" [ref=e8] [cursor=pointer]
  - main [ref=e9]:
    - heading "Book a bike" [level=1] [ref=e10]
    - generic [ref=e12]: Overlapping booking exists for this bike
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]: Bike ID
        - spinbutton [ref=e17]: "3"
      - generic [ref=e18]:
        - generic [ref=e19]: Pick-up (local)
        - textbox [ref=e20]: 2026-07-20T08:00
      - generic [ref=e21]:
        - generic [ref=e22]: Drop-off (local)
        - textbox [ref=e23]: 2026-07-23T08:00
      - generic [ref=e24]:
        - generic [ref=e25]: Notes
        - textbox [ref=e26]
      - paragraph [ref=e27]: Pick-up must be in the future; drop-off after pick-up.
      - button "Create booking" [ref=e28] [cursor=pointer]
```

# Test source

```ts
  11  |   });
  12  | 
  13  |   test('TC-BOOK-01: Booking page requires auth', async ({ page }) => {
  14  |     await page.evaluate(() => localStorage.clear());
  15  |     await page.goto('/booking.html');
  16  |     await expect(page).toHaveURL(/login\.html/);
  17  |   });
  18  | 
  19  |   test('TC-BOOK-02: Create booking happy path', async ({ page }, testInfo) => {
  20  |     const offset = 5 + testInfo.workerIndex * 4;
  21  |     const pickup = localDateTime(offset, 10);
  22  |     const dropoff = localDateTime(offset, 16);
  23  |     const booking = new BookingPage(page);
  24  |     await booking.open('3');
  25  |     await booking.fillBooking(3, pickup, dropoff);
  26  |     await booking.submit.click();
  27  |     await expect(page.locator('.msg-success')).toContainText('Booking #');
  28  |   });
  29  | 
  30  |   test('TC-BOOK-03: Drop-off before pick-up shows error', async ({ page }) => {
  31  |     const booking = new BookingPage(page);
  32  |     await booking.open('2');
  33  |     const pickup = localDateTime(20, 14);
  34  |     const dropoff = localDateTime(20, 10);
  35  |     await booking.fillBooking(2, pickup, dropoff);
  36  |     await booking.submit.click();
  37  |     await expect(page.locator('.msg-error')).toBeVisible();
  38  |   });
  39  | 
  40  |   test('TC-BOOK-04: Past pick-up rejected', async ({ page }) => {
  41  |     const booking = new BookingPage(page);
  42  |     await booking.open('2');
  43  |     await booking.bikeId.fill('2');
  44  |     const past = new Date();
  45  |     past.setDate(past.getDate() - 2);
  46  |     const p = (n) => String(n).padStart(2, '0');
  47  |     const pastStr = `${past.getFullYear()}-${p(past.getMonth() + 1)}-${p(past.getDate())}T10:00`;
  48  |     const fut = localDateTime(25, 18);
  49  |     await booking.pickup.fill(pastStr);
  50  |     await booking.dropoff.fill(fut);
  51  |     await booking.submit.click();
  52  |     await expect(page.locator('.msg-error')).toContainText('past');
  53  |   });
  54  | 
  55  |   test('TC-BOOK-05: Overlap booking rejected', async ({ page }, testInfo) => {
  56  |     const day = 40 + testInfo.workerIndex;
  57  |     const pickup = localDateTime(day, 9);
  58  |     const dropoff = localDateTime(day, 17);
  59  |     const booking = new BookingPage(page);
  60  |     await booking.open('1');
  61  |     await booking.fillBooking(1, pickup, dropoff);
  62  |     await booking.submit.click();
  63  |     await expect(page.locator('.msg-success')).toBeVisible();
  64  |     await booking.open('1');
  65  |     await booking.fillBooking(1, pickup, dropoff);
  66  |     await booking.submit.click();
  67  |     await expect(page.locator('.msg-error')).toContainText('Overlapping');
  68  |   });
  69  | 
  70  |   test('TC-BOOK-06: Calendar inputs visible', async ({ page }) => {
  71  |     const booking = new BookingPage(page);
  72  |     await booking.open('4');
  73  |     await expect(booking.pickup).toBeVisible();
  74  |     await expect(booking.dropoff).toBeVisible();
  75  |   });
  76  | 
  77  |   test('TC-BOOK-07: Notes optional', async ({ page }, testInfo) => {
  78  |     const day = 60 + testInfo.workerIndex;
  79  |     const booking = new BookingPage(page);
  80  |     await booking.open('5');
  81  |     await booking.fillBooking(5, localDateTime(day, 11), localDateTime(day, 15));
  82  |     await page.locator('#notes').fill('Please include helmet');
  83  |     await booking.submit.click();
  84  |     await expect(page.locator('.msg-success')).toBeVisible();
  85  |   });
  86  | 
  87  |   test('TC-BOOK-08: Unknown bike id from API', async ({ page }) => {
  88  |     const booking = new BookingPage(page);
  89  |     await booking.open();
  90  |     await booking.fillBooking(99999, localDateTime(70, 10), localDateTime(70, 12));
  91  |     await booking.submit.click();
  92  |     await expect(page.locator('.msg-error')).toBeVisible();
  93  |   });
  94  | 
  95  |   test('TC-BOOK-09: Booking link from detail prefills bike', async ({ page }) => {
  96  |     await page.goto('/bike-detail.html?id=4');
  97  |     await page.getByRole('link', { name: 'Book this bike' }).click();
  98  |     await expect(page.getByTestId('book-bike-id')).toHaveValue('4');
  99  |   });
  100 | 
  101 |   test('TC-BOOK-10: Long rental window calculates amount', async ({ page }, testInfo) => {
  102 |     const day = 80 + testInfo.workerIndex;
  103 |     const booking = new BookingPage(page);
  104 |     await booking.open('3');
  105 |     await booking.fillBooking(
  106 |       3,
  107 |       localDateTime(day, 8),
  108 |       localDateTime(day + 3, 8)
  109 |     );
  110 |     await booking.submit.click();
> 111 |     await expect(page.locator('.msg-success')).toContainText('Booking #');
      |                                                ^ Error: expect(locator).toContainText(expected) failed
  112 |   });
  113 | });
  114 | 
```