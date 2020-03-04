<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <!-- Login Tab Content -->
          <div class="account-content">
            <div class="row align-items-center justify-content-center">
              <div class="col-md-7 col-lg-6 login-left">
                <img
                  src="@/assets/img/login-banner.png"
                  class="img-fluid"
                  alt="Doccure Login"
                />
              </div>
              <div class="col-md-12 col-lg-6 login-right">
                <div class="login-header">
                  <h3>
                    Login
                    <span>Doktors</span>
                  </h3>
                </div>
                <div id="firebaseui-auth-container"></div>
              </div>
            </div>
          </div>
          <!-- /Login Tab Content -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jQuery from 'jquery'
import firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'

export default {
  created() {
    jQuery('body').addClass('account-page')
    this.$store.commit('updateSelectItem', 'Login')
  },
  destroyed() {
    jQuery('body').removeClass('account-page')
  },
  mounted() {
    const uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            type: 'image', // 'audio'
            size: 'invisible', // 'invisible' or 'compact'
            badge: 'bottomleft' // ' bottomright' or 'inline' applies to invisible.
          },
          defaultCountry: 'IQ', // Set default country
          whitelistedCountries: ['+964']
        }
      ]
    }
    if (!firebaseui.auth.AuthUI.getInstance()) {
      let ui = new firebaseui.auth.AuthUI(firebase.auth())
      if (firebaseui.auth.AuthUI.getInstance()) {
        ui = firebaseui.auth.AuthUI.getInstance()
      }

      ui.start('#firebaseui-auth-container', uiConfig)
    } else {
      firebaseui.auth.AuthUI.getInstance().start(
        '#firebaseui-auth-container',
        uiConfig
      )
    }
  }
}
</script>

<style lang="css" scoped></style>
