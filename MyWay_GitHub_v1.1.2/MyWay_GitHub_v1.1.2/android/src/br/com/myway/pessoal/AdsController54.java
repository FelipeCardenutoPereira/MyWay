package br.com.myway.pessoal;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;
import com.google.ads.mediation.admob.AdMobAdapter;
import com.google.android.gms.ads.*;
import com.google.android.gms.ads.rewarded.*;
import com.google.android.ump.*;
import org.json.JSONObject;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/** Google ads remain separate from the WebView and never receive profile records. */
final class AdsController54 {
 interface Events { void status(JSONObject value); void reward(JSONObject value); }
 private final Activity activity;
 private final Events events;
 private final SharedPreferences prefs;
 private final ConsentInformation consent;
 private final Handler main=new Handler();
 private final Set<String> safeViews=new HashSet<>(Arrays.asList("control","rewards","inspiration","games","novanilla"));
 private LinearLayout host;
 private AdView banner;
 private RewardedAd rewarded;
 private boolean resumed=false,eligible=false,initialized=false,initializing=false,consentStarted=false,consentBusy=false,destroyed=false,fullScreen=false,bannerLoaded=false,rewardLoading=false;
 private String view="",scope="",status="idle",rewardRequest="";
 private long lastBannerAttempt=0,lastRewardAttempt=0;
 private boolean rewardFailed=false;
 private int bannerWidth=0;
 private final View.OnLayoutChangeListener sizeListener=(v,l,t,r,b,ol,ot,or,ob)->{if(banner!=null&&r-l>0&&bannerWidth!=availableWidth()){banner.destroy();banner=null;bannerLoaded=false;lastBannerAttempt=0;hideBanner();main.post(this::update);}};
 private int availableWidth(){int pixels=host!=null&&host.getParent() instanceof View&&((View)host.getParent()).getWidth()>0?((View)host.getParent()).getWidth():activity.getResources().getDisplayMetrics().widthPixels;return Math.max(1,(int)(pixels/activity.getResources().getDisplayMetrics().density));}
 AdsController54(Activity activity,Events events){this.activity=activity;this.events=events;prefs=activity.getSharedPreferences("myway-ads54",0);consent=UserMessagingPlatform.getConsentInformation(activity);}
 private int dp(int n){return Math.round(n*activity.getResources().getDisplayMetrics().density);}
 void bind(LinearLayout newHost){if(host!=null&&host.getParent() instanceof View)((View)host.getParent()).removeOnLayoutChangeListener(sizeListener);if(banner!=null){banner.destroy();banner=null;}host=newHost;bannerLoaded=false;host.setVisibility(View.GONE);if(host.getParent() instanceof View)((View)host.getParent()).addOnLayoutChangeListener(sizeListener);update();}
 JSONObject info(String owner){
  JSONObject v=new JSONObject();try{
   v.put("mode",BuildConfig.ADS_TEST_MODE?"test":"production");v.put("enabled",canRequest());v.put("status",status);v.put("rewardReady",rewarded!=null&&!fullScreen);v.put("rewardLoading",rewardLoading||initializing);v.put("rewardUnavailable",rewardFailed);v.put("privacyRequired",!BuildConfig.ADS_TEST_MODE&&consent.getPrivacyOptionsRequirementStatus()==ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED);v.put("scope",owner);v.put("auroraUnlocked",validScope(owner)&&prefs.getBoolean("aurora."+owner,false));
  }catch(Exception ignored){}return v;
 }
 private boolean validScope(String value){return value!=null&&value.matches("[a-f0-9]{64}");}
 private boolean canRequest(){if(BuildConfig.THEMATIC_ONLY_57)return false;return BuildConfig.ADS_TEST_MODE?prefs.getBoolean("testAccepted",false):consent.canRequestAds();}
 private void notifyStatus(){if(!destroyed)events.status(info(scope));}
 void context(String name,String owner,boolean locked,boolean focused,boolean modal,boolean keyboard){
  view=name;scope=validScope(owner)?owner:"";eligible=validScope(scope)&&!locked&&!focused&&!modal&&!keyboard&&safeViews.contains(name);update();
 }
 void forget(String owner){if(validScope(owner))prefs.edit().remove("aurora."+owner).apply();obscure();notifyStatus();}
 void enable(){if(BuildConfig.THEMATIC_ONLY_57)return;
  if(destroyed||!resumed||!eligible)return;
  if(canRequest()){update();return;}
  if(BuildConfig.ADS_TEST_MODE){new AlertDialog.Builder(activity).setTitle("Ativar anúncios de teste?").setMessage("Esta versão usa anúncios de demonstração do Google. Ao ativar, o SDK do Google fará solicitações de teste. Eles não geram receita e não recebem seus registros do MyWay.").setPositiveButton("Ativar",(d,w)->{prefs.edit().putBoolean("testAccepted",true).apply();update();}).setNegativeButton("Agora não",null).show();}
  else gatherConsent(true);
 }
 void privacy(){
  if(destroyed||!resumed)return;
  if(BuildConfig.ADS_TEST_MODE){new AlertDialog.Builder(activity).setTitle("Anúncios de teste").setMessage("Você pode interromper os anúncios de demonstração neste aparelho.").setPositiveButton("Desativar testes",(d,w)->{prefs.edit().putBoolean("testAccepted",false).apply();update();}).setNegativeButton("Manter",null).show();return;}
  if(consent.getPrivacyOptionsRequirementStatus()!=ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED){gatherConsent(true);return;}
  consentBusy=true;hideBanner();UserMessagingPlatform.showPrivacyOptionsForm(activity,error->{consentBusy=false;if(!destroyed)update();});
 }
 private void gatherConsent(boolean retry){
  if(destroyed||consentBusy||(!retry&&consentStarted)||!resumed||!eligible)return;consentStarted=true;consentBusy=true;hideBanner();status="consent";notifyStatus();
  consent.requestConsentInfoUpdate(activity,new ConsentRequestParameters.Builder().build(),()->{
   if(destroyed)return;
   // If the user moved to a protected screen while the network request ran, defer the form.
   if(!resumed||!eligible){consentBusy=false;consentStarted=false;status="idle";notifyStatus();return;}
   UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity,error->{consentBusy=false;if(destroyed)return;status=error!=null&&!consent.canRequestAds()?"consent-unavailable":"idle";update();});
  },error->{consentBusy=false;if(destroyed)return;status="consent-unavailable";update();});
 }
 private AdRequest request(){Bundle extra=new Bundle();extra.putString("npa","1");return new AdRequest.Builder().addNetworkExtrasBundle(AdMobAdapter.class,extra).build();}
 private void update(){if(BuildConfig.THEMATIC_ONLY_57){hideBanner();return;}
  if(destroyed)return;
  if(!resumed||!eligible||fullScreen||consentBusy){hideBanner();notifyStatus();return;}
  if(!BuildConfig.ADS_TEST_MODE&&!consentStarted){gatherConsent(false);return;}
  if(!canRequest()){hideBanner();if(BuildConfig.ADS_TEST_MODE)status="test-disabled";notifyStatus();return;}
  if(!initialized){
   if(initializing)return;initializing=true;status="initializing";notifyStatus();
   new Thread(()->{try{MobileAds.setRequestConfiguration(new RequestConfiguration.Builder().setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_G).build());MobileAds.initialize(activity,result->main.post(()->{if(destroyed)return;initializing=false;initialized=true;status="ready";update();}));}catch(Exception e){main.post(()->{initializing=false;status="unavailable";notifyStatus();});}},"MyWay-ad-init").start();return;
  }
  if(banner==null&&System.currentTimeMillis()-lastBannerAttempt>60000)loadBanner();
  if(banner!=null&&bannerLoaded){host.setVisibility(View.VISIBLE);banner.resume();}else hideBanner();
  if(rewarded==null&&!rewardLoading&&System.currentTimeMillis()-lastRewardAttempt>60000)loadReward();
  notifyStatus();
 }
 private void hideBanner(){if(host!=null)host.setVisibility(View.GONE);if(banner!=null)banner.pause();}
 private void loadBanner(){
  if(host==null||!canRequest())return;lastBannerAttempt=System.currentTimeMillis();host.removeAllViews();host.setPadding(0,dp(12),0,dp(4));
  TextView label=new TextView(activity);label.setText(BuildConfig.ADS_TEST_MODE?"Publicidade · teste":"Publicidade");label.setTextSize(10);label.setTextColor(0xff718490);label.setGravity(android.view.Gravity.CENTER);label.setPadding(0,0,0,dp(4));host.addView(label,new LinearLayout.LayoutParams(-1,-2));
  AdView ad=new AdView(activity);banner=ad;bannerLoaded=false;ad.setAdUnitId(BuildConfig.ADMOB_BANNER_ID);
  int width=availableWidth();bannerWidth=width;
  ad.setAdSize(AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(activity,width));host.addView(ad,new LinearLayout.LayoutParams(-1,-2));
  ad.setAdListener(new AdListener(){@Override public void onAdLoaded(){if(destroyed||banner!=ad)return;bannerLoaded=true;status="ready";update();}@Override public void onAdFailedToLoad(LoadAdError error){if(destroyed||banner!=ad)return;ad.destroy();banner=null;bannerLoaded=false;status="unavailable";hideBanner();notifyStatus();}});ad.loadAd(request());
 }
 private void loadReward(){
  if(!canRequest())return;rewardLoading=true;rewardFailed=false;lastRewardAttempt=System.currentTimeMillis();
  RewardedAd.load(activity,BuildConfig.ADMOB_REWARDED_ID,request(),new RewardedAdLoadCallback(){@Override public void onAdLoaded(RewardedAd ad){if(destroyed)return;rewardLoading=false;rewardFailed=false;rewarded=ad;notifyStatus();}@Override public void onAdFailedToLoad(LoadAdError error){if(destroyed)return;rewardLoading=false;rewardFailed=true;rewarded=null;notifyStatus();}});
 }
 String showReward(String id,String owner){
  if(destroyed||!resumed||!eligible||!"rewards".equals(view)||!scope.equals(owner)||!validScope(owner)||!id.matches("[a-zA-Z0-9_-]{1,100}"))return "denied";
  if(fullScreen||!rewardRequest.isEmpty())return "busy";
  if(!canRequest())return "consent-required";
  if(rewarded==null){if(initialized&&!rewardLoading&&System.currentTimeMillis()-lastRewardAttempt>60000)loadReward();return "loading";}
  RewardedAd ad=rewarded;rewarded=null;rewardRequest=id;fullScreen=true;hideBanner();final boolean[] earned={false};
  ad.setFullScreenContentCallback(new FullScreenContentCallback(){@Override public void onAdDismissedFullScreenContent(){fullScreen=false;rewardRequest="";emitReward(id,owner,earned[0]?"completed":"closed");lastRewardAttempt=0;update();}@Override public void onAdFailedToShowFullScreenContent(AdError error){fullScreen=false;rewardRequest="";emitReward(id,owner,"failed");update();}});
  ad.show(activity,item->{
   if(earned[0])return;earned[0]=true;
   // Grant only the non-monetary cosmetic, and retain delivery across WebView recreation.
   prefs.edit().putBoolean("aurora."+owner,true).commit();emitReward(id,owner,"earned");
  });notifyStatus();return "showing";
 }
 private void emitReward(String id,String owner,String outcome){JSONObject v=new JSONObject();try{v.put("id",id);v.put("scope",owner);v.put("outcome",outcome);}catch(Exception ignored){}if(!destroyed)events.reward(v);}
 void pause(){resumed=false;hideBanner();}
 void resume(){resumed=true;update();}
 void obscure(){eligible=false;hideBanner();}
 void destroy(){destroyed=true;if(host!=null&&host.getParent() instanceof View)((View)host.getParent()).removeOnLayoutChangeListener(sizeListener);main.removeCallbacksAndMessages(null);if(banner!=null)banner.destroy();banner=null;rewarded=null;}
}
