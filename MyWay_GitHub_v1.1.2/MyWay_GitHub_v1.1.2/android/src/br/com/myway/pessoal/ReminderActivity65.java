package br.com.myway.pessoal;
import android.os.Bundle;
import android.os.Build;
import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;
import android.webkit.*;
import android.view.View;
import android.content.pm.PackageManager;
import java.lang.reflect.Field;
import org.json.JSONObject;

/** Small native extension; keeps storage, media, ads and picker handling intact. */
public class ReminderActivity65 extends MainActivity {
 private WebView view65;
 @Override public void onCreate(Bundle b){
  super.onCreate(b);
  try{Field f=MainActivity.class.getDeclaredField("web");f.setAccessible(true);view65=(WebView)f.get(this);final WebChromeClient old=view65.getWebChromeClient();
   view65.setWebChromeClient(new WebChromeClient(){
    @Override public boolean onJsPrompt(WebView v,String url,String msg,String data,JsPromptResult result){
     if(!"MYWAY65".equals(msg))return old.onJsPrompt(v,url,msg,data,result);
     if(!trusted65(url)||!trusted65(v.getUrl())){result.confirm("{\"ok\":false}");return true;}
     try{JSONObject o=new JSONObject(data),answer=action65(o);result.confirm(answer.toString());}catch(Exception ex){result.confirm("{\"ok\":false}");}return true;
    }
    @Override public boolean onJsAlert(WebView v,String u,String m,JsResult r){return old.onJsAlert(v,u,m,r);}
    @Override public boolean onJsConfirm(WebView v,String u,String m,JsResult r){return old.onJsConfirm(v,u,m,r);}
    @Override public boolean onConsoleMessage(ConsoleMessage m){return old.onConsoleMessage(m);}
    @Override public boolean onShowFileChooser(WebView v,ValueCallback<Uri[]> c,FileChooserParams p){return old.onShowFileChooser(v,c,p);}
    @Override public void onShowCustomView(View v,CustomViewCallback c){old.onShowCustomView(v,c);}
    @Override public void onHideCustomView(){old.onHideCustomView();}
    @Override public void onPermissionRequest(PermissionRequest p){old.onPermissionRequest(p);}
   });
  }catch(Exception ignored){}
  ReminderEngine65.schedule(this);
 }
 private boolean trusted65(String url){if(url==null)return false;Uri u=Uri.parse(url);return "https".equals(u.getScheme())&&"appassets.androidplatform.net".equals(u.getHost())&&(u.getPort()==-1||u.getPort()==443)&&"/assets/www/index.html".equals(u.getPath());}
 private JSONObject action65(JSONObject o)throws Exception{
  String a=o.optString("action");
  if("sync".equals(a)){ReminderEngine65.sync(this,o.getJSONObject("plan"));}
  else if("enable".equals(a)){boolean on=o.optBoolean("on");ReminderEngine65.enable(this,on);if(on&&Build.VERSION.SDK_INT>=33&&checkSelfPermission("android.permission.POST_NOTIFICATIONS")!=PackageManager.PERMISSION_GRANTED){if(shouldShowRequestPermissionRationale("android.permission.POST_NOTIFICATIONS")||!getPreferences(0).getBoolean("asked65",false)){getPreferences(0).edit().putBoolean("asked65",true).apply();requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"},65);}else settings65();}}
  else if("test".equals(a)){return new JSONObject().put("ok",ReminderEngine65.test(this));}
  else if("exact".equals(a)){if(Build.VERSION.SDK_INT>=31)startActivity(new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM,Uri.parse("package:"+getPackageName())));}
  else if("settings".equals(a)){settings65();}
  else if(!"info".equals(a))return new JSONObject().put("ok",false);
  return ReminderEngine65.info(this);
 }
 private void settings65(){Intent i=new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);i.putExtra(Settings.EXTRA_APP_PACKAGE,getPackageName());startActivity(i);}
 @Override public void onRequestPermissionsResult(int r,String[] p,int[] g){super.onRequestPermissionsResult(r,p,g);if(r==65)ReminderEngine65.schedule(this);}
 @Override public void onResume(){super.onResume();ReminderEngine65.schedule(this);if(view65!=null)view65.evaluateJavascript("window.dispatchEvent(new Event('focus'))",null);}
 @Override public void onBackPressed(){if(view65==null){super.onBackPressed();return;}view65.evaluateJavascript("Boolean(window.mywayBack65&&window.mywayBack65())",new ValueCallback<String>(){public void onReceiveValue(String result){if(!"true".equals(result))ReminderActivity65.super.onBackPressed();}});}
}
