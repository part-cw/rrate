# rrate
A new version of the RRate app in React and React Native.

# Installation

This app is built with Expo. [Please see the Expo Docs](https://docs.expo.dev/get-started/installation/) for installing prerequisites.

After cloning the repo, run `npm install` from the project directory to install dependencies.

# Running

To run:

 ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo



After launching, you can open the app on another platform simultaneously by pressing **a** (android) **i** (ios) or **w** (web) in the console.


# Accessing the Configuration Settings
This version of RRate ensures data security and protects features of the RRate algorithm by keeping some settings password-protected. If you are using RRate as part of an ongoing research project and require any of the following functions for your project, please contact the Institute for Global Health at part.cw@gmail.com to receive the password: 

- changing the consistency threshold
- changing the number of required taps
- using a 60 second timer instead of the RRate algorithm
- sending data to a REDCap project

# External Launches of RRate
RRate can be launched through an external application using a deep link to the launch page. After taking a measurement, RRate will navigate to the provided return URL and append the measured respiratory rate as URI-encoded JSON, formatted as a FHIR Respiratory Rate Vital Signs Observation. You can unencode the "observation" parameter to access the FHIR observation for data storage or upload to a FHIR server.
- Web: https://rrate.netlify.app/launch?patientId=YOUR_PATIENT_ID&returnURL=YOUR_RETURN_URL 
- Mobile: rrate://launch?patientId=YOUR_PATIENT_ID&returnURL=YOUR_RETURN_URL

# Supported Integrations
This version of RRate can be integrated with REDCap and supports data export using SMART on FHIR protocol. Please see the [wiki](https://github.com/part-cw/rrate/wiki) to learn how to set up these integrations. 
