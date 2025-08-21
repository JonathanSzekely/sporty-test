# SportyTest

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.2.

## Development server

Clone the repository, then make sure to install the used packages by running node libraries install command

```bash
npm install
```

Then, to start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


## Architecture and code structure

The simplified component structure is used, with no folder sub-structures due to the simplicity of the project.
Components, Models and Services have been created to showcase best practices, even if the modules are almost redunant at this scale.

Even if reliance is heavy on the components provided by PrimeNG, I chose to wrap those in my own components to provide a clerer separation between the app logic and the librarie's components, as well as handling app specific events in the app's components.

Used templated driven for for the search, no need for dynamic forms and this is a good use case for the template variant as well.

Used 2 approaches to unsubscribing: the async pipe that allows angular to cleanup using its default mechanisms for the sport-select component, as well as the subject pattern to manually clean up when the component is destroyed. While consistency may be preferred, it's prefferable to lean on the angular's internal mechanisms, so the async example was used to showcase a more concise and intended approach.


## AI Tools
Integrated VSCode Github Copilot with Claude Sonnet 3.5 was used to quickly scaffold smaller bits of code, focusing on one action or component functionality at the time, then adjusting as needed. 

ChatGPT was used to write the models by using the api data responses.

It's important for the bits that are generated to be reasonably grasped mentally at a glance to make sure we stay in control as we benefit from the extra speed.

Some examples of AI usage here:
	- generate models based on json response data shape
	- generate PrimeNG card template for quick use after adjusting config
	- generate the league-list template layout, with @ngfor, as well as load the leagues from the service making use of signals, a loader, and error handling displayed with p-message
	- generate sportSelect template using p-select syntax, adjust settings as necessary
