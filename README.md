# Salling Group Stores SDK
This SDK simplifies the process of querying Salling Group's Holidays API.
Through this SDK you will be able to query Danish (as of now) holidays.
The requests are made through the Salling Group API which can be found [here](https://developer.sallinggroup.com/).

You will need the module `sg-base-sdk` in order to authenticate.
You can get your credentials through the [developer portal](https://developer.sallinggroup.com/).

## Getting Started.
This prints a list of the holidays of 2017 and whether they are [national holidays](#holiday-entry).
You will need to get a JWT secret or Bearer token with access to the Stores API from the [developer portal](https://developer.sallinggroup.com/). 
```js
const { SallingGroupAPI } = require('sg-base-sdk');
const HolidaysSDK = require('./index');
const instance = new HolidaysSDK(SallingGroupAPI.bearer('my_token'));

instance.holidaysInBetween('2017-01-01', '2017-12-31').then((holidays) => {
  for (const holiday of holidays) {
    console.log(`${holiday.date} - ${holiday.name}${holiday.nationalHoliday ? ' (national)' : ''}`);
  }
});
``` 
This would output:
```
2017-01-01 - Nytårsdag (national)
2017-01-06 - Helligtrekongersdag
2017-02-14 - Valentinsdag
2017-02-26 - Fastelavn
2017-04-09 - Palmesøndag
2017-04-13 - Skærtorsdag (national)
2017-04-14 - Langfredag (national)
2017-04-16 - Påskedag (national)
2017-04-17 - 2. påskedag (national)
2017-05-12 - Store bededag (national)
2017-05-14 - Mors dag
2017-05-25 - Kristi Himmelfartsdag (national)
2017-06-04 - Pinsedag (national)
2017-06-05 - 2. pinsedag (national)
2017-06-05 - Grundlovsdag (national)
2017-06-05 - Fars dag
2017-06-23 - Sankt Hans aften
2017-06-24 - Sankt Hans dag
2017-10-31 - Allehelgensaften
2017-11-11 - Mortensdag
2017-11-24 - Black Friday
2017-12-24 - Juleaftensdag (national)
2017-12-25 - 1. juledag (national)
2017-12-26 - 2. juledag (national)
2017-12-31 - Nytårsaftensdag (national)
```

## Holiday Entry
A holiday entry from the API is an object with the following properties:

Name|Type|Description
----|----|-----------
`name`|`string`|The name of the holiday.
`data`|`string`|The date of the holiday. (ISO-8601 string)
`nationalHoliday`|`boolean`|Whether the holiday is a national holiday. This means that the holiday is publicly recognized by the government (i.e. people are off work).

An example of this could be:
```json
{ 
  "date": "2018-10-31",
  "name": "Allehelgensaften",
  "nationalHoliday": false
}
```

## Documentation
### `constructor(api)`
This initializes a new Holidays SDK object.
`api` must be an instance returned by `sg-base-sdk`.

Example:
```js
const { SallingGroupAPI } = require('sg-base-sdk');
const HolidaysSDK = require('sg-holidays-sdk');
const instance = new HolidaysSDK(SallingGroupAPI.jwt('my_email', 'my_key'));
```

### `async isHoliday(date)`
This checks whether the given date is a holiday.

Example:
```js
const date = '2017-12-24';
if (await instance.isHoliday(date)) {
  console.log(`${date} is a holiday.`);
} else {
  console.log(`${date} is not a holiday.`);
}
```

### `async holidaysInBetween(startDate, endDate)`
This gets a list of holidays in-between the two given dates.

Example:
```js
for (const holiday of await instance.holidaysInBetween('2017-05-11', '2017-10-01')) {
    console.log(holiday.name);
}
```

### `async holidaysUntil(date)`
This gets a list of holidays in-between today and the given date.

Example:
```js
for (const holiday of await instance.holidaysUntil('2018-10-01')) {
    console.log(holiday.name);
}
```

### `async holidaysWithinUpcomingYear()`
This gets a list of holidays within the upcoming year from today.

Example:
```js
for (const holiday of await instance.holidaysWithinUpcomingYear()) {
    console.log(holiday.name);
}
```

### `async nextHoliday()`
This gets the next upcoming holiday.

Example:
```js
instance.nextHoliday().then((holiday) => {
  console.log(`The next holiday is ${holiday.name}.`);
  console.log(`The date of the holiday is ${holiday.date}.`);
  console.log(holiday.nationalHoliday ?
    'This is a national holiday.' : 'This is not a national holiday.'
  );
});
```
