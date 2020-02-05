# Keepscore

## A terrible dashboard-scoreboard to compete on useless metrics


### Developer notes

To run the services locally, you have to run:
```sh
$ npm start # Starts web client application

# in a separate terminal shell
$ firebase emulators:start --only functions # Starts function emulator
```

To refresh the firebase function remote configuration run
```sh
$ ./scripts/refresh_config.sh
```
and restart the functions emulator
