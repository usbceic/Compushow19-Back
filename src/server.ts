import app from './app'
import config from './config'

app.listen(config.PORT, () => {
  console.log('Server listening at port ' + config.PORT)
})
