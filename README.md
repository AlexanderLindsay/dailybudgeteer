# Daily Budgeteer

Daily Budgeteer was inspired by [this blog post by Alex Recker](http://alexrecker.com/our-new-sid-meiers-civilization-inspired-budget/) where he explains a budgeting tool which organizes your expenses around a Per Day modal. As in, breaking down all your costs and income to see how much you are making and spending per day. After the post got enough attention, he decided to create an improved version which you can find [here](https://github.com/arecker/bennedetto).

So Daily Budgeteer is different from those two projects in the fact that it is not a website. I built it in [Electron](http://electron.atom.io/), so it is a desktop app. This has a couple interesting pros and cons for a project like this. The major con is that you can't interact with it from your phone, though I want to get back to that. The major benefit, is that it doesn't have to deal with security concerns, or at least no more than any other file on your system.

So the way Daily Budgeteer works is that it read/writes to/from JSON files. This leads back to the phone issue. I am thinking that a phone app could be created to read/write from a JSON file in the same format and store the file in google drive, or some other storage system accessible from your phone. Then the desktop app and the phone app could be connected.

## How To Use

![Empty Rates List](/readme-images/Rates-Empty.PNG)

The application is fairly simple to use. Add any recurring costs or income as a rate. Make sure that costs are marked as negative values and set the time interval and interval type. For example, if the rate is once a month then choose a Month in the Interval Type dropdown list. 

![Add Rates](/readme-images/AddRate.PNG)

When the Per Day value of the rate is calculated it will be based on the number of days in the current month.

![RatesList ](/readme-images/Rates-Examples.PNG)

Then add expenses as they occur. Again, make sure to use negative values as appropate. 

![Expenses](/readme-images/Expenses-Examples.PNG)

If you added rates than the first entry on each day's list of expenses will be the base line value what you are making or spending if you don't do anything that day.

![Summary Tab](/readme-images/Summary.PNG)

The summary tab shows a line graph of the last two weeks of activity.

## JSON Format

Here is what the JSON that the application saves to/loads from

```json
{
    "expenses": [
        {
            "id": 1,
            "name": "SUPERHOT",
            "day": "2016-03-20T07:00:00.000Z",
            "amount": -25
        }
    ],
    "rates": [
        {
            "id": 1,
            "name": "Test Rate",
            "amount": 200,
            "interval": "14",
            "intervalType": 0,
            "startDate": "2016-03-20T07:00:00.000Z"
        }
    ],
    "nextIds": {
        "expenses": 2,
        "rates": 2
    }
}
```

If the rate has ended then it will have an `endDate` as well as a start date.

## How to Develop

#### Prerequisites
- [node](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [TypeScript](http://www.typescriptlang.org/)
- [typings](https://github.com/typings)
- [ava](https://github.com/sindresorhus/ava)

I am also using [semantic-ui](http://semantic-ui.com/), but I need to integrate it better. For now, to get it working you need to run `gulp semantic-build`.

I think that is everything that you need to install ahead of time. I think typings is optional at the moment as the typings folder is saved in git. 

I was using Visual Studio Code to write the application, but that shouldn't be a requirment. 

Once you have all the prerequisites, clone the repository and type `npm install`. There are several gulp and/or npm tasks that can be run. The npm tasks call the gulp tasks. The tasks can also be run using Visual Studio Code's task runner. The build and test are hooked up to the Build and Test tasks in Visual Studio Code.

- clean
  - This removes the javascript files compiled from the typescript files
  - `npm run clean`
  - `gulp clean`
- build
  - This creates a development build
  - `npm run build`
  - `gulp build`
- test
  - This runs the ava test suite
  - `npm run test`
  - `gulp test`
- package
  - This packages the electron app
  - `npm run package`
  - `gulp package`
  
## Contributing

If you feel that this is missing something or you wish to contribute feel free to add an issue or make a pull request.
