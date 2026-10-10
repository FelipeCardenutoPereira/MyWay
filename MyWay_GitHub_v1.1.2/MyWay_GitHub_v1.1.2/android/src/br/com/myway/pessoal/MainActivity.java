package br.com.myway.pessoal;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.ActivityNotFoundException;
import android.speech.RecognizerIntent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.AtomicFile;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.*;
import android.widget.*;
import org.json.JSONObject;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicReference;

/** Local HTTPS assets, native storage and an isolated Google Ads controller. */
public class MainActivity extends Activity {
 private static final String HOST="appassets.androidplatform.net", START="https://"+HOST+"/assets/www/index.html";
 private static final int PICK_FILE=11,SAVE_DOCUMENT=12,VOICE49=49;
 private AdsController54 ads54; private LinearLayout bannerHost54;
 private WebView web; private FrameLayout root; private ValueCallback<Uri[]> picker;
 private View customView; private WebChromeClient.CustomViewCallback customCallback;
 private final Handler handler=new Handler();
 private final ExecutorService disk=Executors.newSingleThreadExecutor();
 private final AtomicReference<String> pendingState=new AtomicReference<>();
 private final java.util.concurrent.atomic.AtomicBoolean writing=new java.util.concurrent.atomic.AtomicBoolean(false);
 private String voiceRequest49;
 private String exportText,exportName,exportMime; private boolean appReady=false,immersive=false;
 private AtomicFile stateFile; private boolean keyboard43=false,dark43=true;
 @Override public void onCreate(Bundle bundle){
  super.onCreate(bundle);
  stateFile=new AtomicFile(new File(getFilesDir(),"myway-state.json"));
  root=new FrameLayout(this);root.setBackgroundColor(Color.rgb(2,13,22));setContentView(root);
  if(Build.VERSION.SDK_INT>=30){
   getWindow().setDecorFitsSystemWindows(false);
   root.setOnApplyWindowInsetsListener((v,insets)->{
    int barsType=WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout(),handled=barsType|WindowInsets.Type.ime();
    android.graphics.Insets bars=insets.getInsets(barsType),ime=insets.getInsets(WindowInsets.Type.ime());
    v.setPadding(bars.left,bars.top,bars.right,Math.max(bars.bottom,ime.bottom));keyboard43=insets.isVisible(WindowInsets.Type.ime());dispatchInsets43();if(ads54!=null&&keyboard43)ads54.obscure();
    // The native container already handles these areas. Forward zero values,
    // rather than consuming notifications, to avoid duplicate WebView padding.
    return new WindowInsets.Builder(insets).setInsets(handled,android.graphics.Insets.NONE).setInsetsIgnoringVisibility(barsType,android.graphics.Insets.NONE).build();
   });
  }
  createWeb();root.requestApplyInsets();
 }
 private boolean local(Uri u){return u!=null&&"https".equals(u.getScheme())&&HOST.equals(u.getHost())&&(u.getPort()==-1||u.getPort()==443);}
 private boolean trustedPrompt(String url){Uri u=Uri.parse(url);return local(u)&&"/assets/www/index.html".equals(u.getPath())&&web!=null&&local(Uri.parse(web.getUrl()==null?START:web.getUrl()));}
 private void createWeb(){
  appReady=false;web=new WebView(this);web.setBackgroundColor(Color.rgb(2,13,22));
  WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);settings.setDatabaseEnabled(true);settings.setAllowFileAccess(false);settings.setAllowContentAccess(true);settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);settings.setMediaPlaybackRequiresUserGesture(false);settings.setSupportMultipleWindows(false);settings.setJavaScriptCanOpenWindowsAutomatically(false);settings.setBuiltInZoomControls(false);settings.setDefaultTextEncodingName("UTF-8");
  CookieManager.getInstance().setAcceptCookie(true);CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
  web.setWebViewClient(new WebViewClient(){
   @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
    Uri u=request.getUrl();if(!local(u))return null;
    String path=u.getPath();if(path==null)return response(404,"text/plain","Arquivo indisponível");
    if("/api/state".equals(path)){
     if(!"GET".equals(request.getMethod()))return response(405,"application/json","{\"ok\":false}");
     try{return stream(200,"application/json",stateFile.openRead());}catch(IOException e){return response(200,"application/json","null");}
    }
    if(path.startsWith("/api/"))return response(404,"application/json","{\"native\":false,\"ok\":false}");
    if(!path.startsWith("/assets/")||path.contains("..")||path.indexOf('\0')>=0)return response(404,"text/plain","Arquivo indisponível");
    String asset=path.substring("/assets/".length());
    try{return stream(200,mime(asset),getAssets().open(asset));}catch(IOException e){return response(404,"text/plain","Arquivo local não encontrado");}
   }
   @Override public void onPageFinished(WebView view,String url){if(local(Uri.parse(url))){dispatchInsets43();root.requestApplyInsets();}}
   @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){
    Uri u=request.getUrl();if(local(u))return false;
    if(!request.isForMainFrame())return false;
    String scheme=u.getScheme();if("https".equals(scheme)||"http".equals(scheme)||"mailto".equals(scheme)){
     try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception e){Toast.makeText(MainActivity.this,"Nenhum aplicativo pode abrir este link.",Toast.LENGTH_LONG).show();}
    }return true;
   }
   @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceError error){if(request.isForMainFrame())showNativeError("O painel não carregou. Você pode tentar novamente sem apagar seus dados.");}
   @Override public boolean onRenderProcessGone(WebView view,RenderProcessGoneDetail detail){if(view.getParent() instanceof android.view.ViewGroup)((android.view.ViewGroup)view.getParent()).removeView(view);view.destroy();web=null;showNativeError("O Android fechou a tela do app. Seus registros já salvos continuam neste aparelho.");return true;}
  });
  web.setWebChromeClient(new WebChromeClient(){
   @Override public boolean onJsPrompt(WebView view,String url,String message,String defaultValue,JsPromptResult result){
    if(!"MYWAY41".equals(message))return false;
    if(!trustedPrompt(url)){result.confirm("denied");return true;}
    try{
     JSONObject obj=new JSONObject(defaultValue);String action=obj.optString("action");
     if("adsInfo54".equals(action)){result.confirm(ads54==null?"{}":ads54.info(obj.optString("scope")).toString());}
     else if("adsContext54".equals(action)){if(ads54!=null)ads54.context(obj.optString("view"),obj.optString("scope"),obj.optBoolean("locked",true),obj.optBoolean("focused",true),obj.optBoolean("modal",true),keyboard43);result.confirm("ok");}
     else if("adsEnable54".equals(action)){if(ads54!=null)ads54.enable();result.confirm("ok");}
     else if("adsPrivacy54".equals(action)){if(ads54!=null)ads54.privacy();result.confirm("ok");}
     else if("adsForget54".equals(action)){if(ads54!=null)ads54.forget(obj.optString("scope"));result.confirm("ok");}
     else if("adsReward54".equals(action)){result.confirm(ads54==null?"unavailable":ads54.showReward(obj.optString("id"),obj.optString("scope")));}
     else if("ready".equals(action)){appReady=true;result.confirm("ok");}
     else if("appearance".equals(action)){applyAppearance43(obj.optBoolean("dark"));result.confirm("ok");}
     else if("fullscreen".equals(action)){applyImmersive41(obj.optBoolean("on"));result.confirm("ok");}
     else if("voice49".equals(action)){
      String id=obj.optString("id");if(!id.matches("[a-zA-Z0-9_-]{1,100}")){result.confirm("denied");return true;}
      if(voiceRequest49!=null){result.confirm("busy");return true;}
      Intent speech=new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);speech.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);speech.putExtra(RecognizerIntent.EXTRA_LANGUAGE,"pt-BR");speech.putExtra(RecognizerIntent.EXTRA_PROMPT,"Diga seu comando para o MyWay");speech.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS,1);speech.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE,true);
      voiceRequest49=id;try{startActivityForResult(speech,VOICE49);result.confirm("ok");}catch(ActivityNotFoundException e){voiceRequest49=null;result.confirm("unavailable");}catch(Exception e){voiceRequest49=null;result.confirm("unavailable");}
     }else if("persist".equals(action)){
      String text=obj.getString("text");if(text.length()>40*1024*1024)throw new IOException("state too large");JSONObject state=new JSONObject(text);if(!state.has("settings")||!state.has("days"))throw new IOException("invalid state");pendingState.set(text);writePending();result.confirm("queued");
     }else if("export".equals(action)){
      if(exportText!=null){result.confirm("busy");Toast.makeText(MainActivity.this,"Conclua o salvamento do arquivo anterior.",Toast.LENGTH_SHORT).show();return true;}
      String text=obj.getString("text");if(text.length()>40*1024*1024)throw new IOException("export too large");exportText=text;exportName=obj.optString("name","MyWay-backup.json").replaceAll("[^a-zA-Z0-9._-]","_");exportMime=obj.optString("type","application/json");
      Intent save=new Intent(Intent.ACTION_CREATE_DOCUMENT);save.addCategory(Intent.CATEGORY_OPENABLE);save.setType(exportMime);save.putExtra(Intent.EXTRA_TITLE,exportName);startActivityForResult(save,SAVE_DOCUMENT);result.confirm("ok");
     }else result.confirm("denied");
    }catch(Exception e){result.confirm("denied");Toast.makeText(MainActivity.this,"Não foi possível concluir. Seus dados salvos foram preservados.",Toast.LENGTH_LONG).show();}return true;
   }
   @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
    if(picker!=null)picker.onReceiveValue(null);picker=callback;
    Intent open=new Intent(Intent.ACTION_OPEN_DOCUMENT);open.addCategory(Intent.CATEGORY_OPENABLE);open.setType("*/*");ArrayList<String> types=new ArrayList<>();
    for(String accepted:params.getAcceptTypes()){for(String item:accepted.split(",")){item=item.trim();if(item.startsWith(".")){String mapped=MimeTypeMap.getSingleton().getMimeTypeFromExtension(item.substring(1));if(mapped!=null)types.add(mapped);}else if(item.contains("/"))types.add(item);}}
    if(!types.isEmpty())open.putExtra(Intent.EXTRA_MIME_TYPES,types.toArray(new String[0]));open.putExtra(Intent.EXTRA_ALLOW_MULTIPLE,params.getMode()==FileChooserParams.MODE_OPEN_MULTIPLE);
    try{startActivityForResult(open,PICK_FILE);}catch(Exception e){picker.onReceiveValue(null);picker=null;Toast.makeText(MainActivity.this,"Não foi possível abrir o seletor de arquivos.",Toast.LENGTH_LONG).show();}return true;
   }
   @Override public void onShowCustomView(View view,CustomViewCallback callback){if(customView!=null){callback.onCustomViewHidden();return;}customView=view;customCallback=callback;if(ads54!=null)ads54.obscure();root.addView(view,new FrameLayout.LayoutParams(-1,-1));web.setVisibility(View.GONE);applyImmersive41(true);}
   @Override public void onHideCustomView(){if(customView==null)return;root.removeView(customView);customView=null;web.setVisibility(View.VISIBLE);customCallback.onCustomViewHidden();customCallback=null;applyImmersive41(false);if(web!=null)web.evaluateJavascript("window.mywayAdsRefresh54&&window.mywayAdsRefresh54()",null);}
  });
  web.setDownloadListener((url,agent,disposition,type,length)->{Uri u=Uri.parse(url);if("https".equals(u.getScheme())){try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception ignored){}}else Toast.makeText(this,"Para salvar seus dados, use Exportar backup na área Dados.",Toast.LENGTH_LONG).show();});
  root.removeAllViews();LinearLayout content54=new LinearLayout(this);content54.setOrientation(LinearLayout.VERTICAL);content54.addView(web,new LinearLayout.LayoutParams(-1,0,1));bannerHost54=new LinearLayout(this);bannerHost54.setOrientation(LinearLayout.VERTICAL);bannerHost54.setVisibility(View.GONE);content54.addView(bannerHost54,new LinearLayout.LayoutParams(-1,-2));root.addView(content54,new FrameLayout.LayoutParams(-1,-1));
  if(ads54==null)ads54=new AdsController54(this,new AdsController54.Events(){public void status(JSONObject value){if(web!=null&&trustedPrompt(web.getUrl()==null?"":web.getUrl()))web.evaluateJavascript("window.mywayAdsStatus54&&window.mywayAdsStatus54("+value.toString()+")",null);}public void reward(JSONObject value){if(web!=null&&trustedPrompt(web.getUrl()==null?"":web.getUrl()))web.evaluateJavascript("window.mywayAdsReward54&&window.mywayAdsReward54("+value.toString()+")",null);}});ads54.bind(bannerHost54);web.loadUrl(START);
  handler.postDelayed(()->{if(!appReady&&web!=null)web.evaluateJavascript("window.mywayShowBootFailure41&&window.mywayShowBootFailure41()",null);},16000);
 }
 private String mime(String file){String ext=MimeTypeMap.getFileExtensionFromUrl(file);if(file.endsWith(".js"))return "application/javascript";if(file.endsWith(".woff2"))return "font/woff2";if(file.endsWith(".svg"))return "image/svg+xml";String mime=MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);return mime==null?"application/octet-stream":mime;}
 private WebResourceResponse response(int code,String mime,String text){return stream(code,mime,new ByteArrayInputStream(text.getBytes(StandardCharsets.UTF_8)));}
 private WebResourceResponse stream(int code,String mime,InputStream input){Map<String,String> headers=new HashMap<>();headers.put("Cache-Control","no-store");headers.put("X-Content-Type-Options","nosniff");return new WebResourceResponse(mime,"UTF-8",code,code==200?"OK":code==405?"Method Not Allowed":"Not Found",headers,input);}
 private void writePending(){
  if(!writing.compareAndSet(false,true))return;
  disk.execute(()->{
   try{String text;while((text=pendingState.getAndSet(null))!=null){boolean ok=false;FileOutputStream out=null;try{out=stateFile.startWrite();out.write(text.getBytes(StandardCharsets.UTF_8));stateFile.finishWrite(out);ok=true;}catch(Exception e){if(out!=null)stateFile.failWrite(out);}final boolean saved=ok;String receipt="";try{JSONObject meta=new JSONObject(text).optJSONObject("meta");if(meta!=null)receipt=meta.optString("clearReceipt55","");}catch(Exception ignored){}final String clearReceipt=receipt;runOnUiThread(()->{if(web!=null)web.evaluateJavascript("window.mywaySaveComplete41&&window.mywaySaveComplete41("+saved+","+JSONObject.quote(clearReceipt)+")",null);});}}
   finally{writing.set(false);if(pendingState.get()!=null)writePending();}
  });
 }
 private void dispatchInsets43(){if(web!=null)web.post(()->{if(web!=null)web.evaluateJavascript("window.mywayWindowInsets43&&window.mywayWindowInsets43({keyboard:"+keyboard43+"});window.mywayAdsRefresh54&&window.mywayAdsRefresh54()",null);});}
 private void applyAppearance43(boolean dark){
  dark43=dark;int background=dark?Color.rgb(15,24,32):Color.rgb(240,237,232);root.setBackgroundColor(background);if(web!=null)web.setBackgroundColor(background);
  getWindow().setStatusBarColor(background);getWindow().setNavigationBarColor(background);
  if(Build.VERSION.SDK_INT>=30){WindowInsetsController c=getWindow().getInsetsController();int mask=WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS|WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;if(c!=null)c.setSystemBarsAppearance(dark?0:mask,mask);}
  else{int flags=getWindow().getDecorView().getSystemUiVisibility();flags=dark?flags&~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR:flags|View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;if(Build.VERSION.SDK_INT>=26)flags=dark?flags&~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR:flags|View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;getWindow().getDecorView().setSystemUiVisibility(flags);}
 }
 private void applyImmersive41(boolean on){
  immersive=on;
  if(Build.VERSION.SDK_INT>=30){WindowInsetsController control=getWindow().getInsetsController();if(control!=null){if(on){control.hide(WindowInsets.Type.systemBars());control.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);}else control.show(WindowInsets.Type.systemBars());}}
  else getWindow().getDecorView().setSystemUiVisibility(on?View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_STABLE:View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
  applyAppearance43(dark43);root.requestApplyInsets();
 }
 private void showNativeError(String message){
  appReady=false;if(ads54!=null)ads54.obscure();LinearLayout layout=new LinearLayout(this);layout.setOrientation(LinearLayout.VERTICAL);layout.setPadding(40,80,40,40);layout.setBackgroundColor(Color.rgb(2,13,22));TextView title=new TextView(this);title.setText("MyWay · vamos tentar novamente");title.setTextSize(22);title.setTextColor(Color.WHITE);TextView text=new TextView(this);text.setText(message+"\n\nConfira também se Android System WebView e Chrome estão atualizados.");text.setTextSize(16);text.setTextColor(Color.rgb(196,216,225));text.setPadding(0,24,0,24);Button retry=new Button(this);retry.setText("Tentar novamente");retry.setOnClickListener(v->{if(web!=null){root.removeView(web);web.destroy();web=null;}createWeb();});Button export=new Button(this);export.setText("Salvar backup já existente");export.setOnClickListener(v->{try{byte[] bytes;try(FileInputStream in=stateFile.openRead();ByteArrayOutputStream buffer=new ByteArrayOutputStream()){byte[] part=new byte[8192];int n;while((n=in.read(part))!=-1)buffer.write(part,0,n);bytes=buffer.toByteArray();}exportText=new String(bytes,StandardCharsets.UTF_8);exportName="MyWay-backup-recuperacao.json";Intent i=new Intent(Intent.ACTION_CREATE_DOCUMENT);i.addCategory(Intent.CATEGORY_OPENABLE);i.setType("application/json");i.putExtra(Intent.EXTRA_TITLE,exportName);startActivityForResult(i,SAVE_DOCUMENT);}catch(Exception e){Toast.makeText(this,"Ainda não há backup local para exportar.",Toast.LENGTH_LONG).show();}});layout.addView(title);layout.addView(text);layout.addView(retry);layout.addView(export);root.removeAllViews();root.addView(layout,new FrameLayout.LayoutParams(-1,-1));
 }
 @Override protected void onActivityResult(int request,int result,Intent data){
  super.onActivityResult(request,result,data);
  if(request==VOICE49){
   final String id=voiceRequest49;voiceRequest49=null;if(id!=null&&web!=null&&trustedPrompt(web.getUrl()==null?"":web.getUrl())){
    JSONObject payload=new JSONObject();try{payload.put("id",id);ArrayList<String> words=result==RESULT_OK&&data!=null?data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS):null;String text=words!=null&&!words.isEmpty()?words.get(0):"";if(text==null)text="";payload.put("text",text.substring(0,Math.min(1000,text.length())));payload.put("cancelled",result!=RESULT_OK);web.evaluateJavascript("window.mywayVoiceResult49&&window.mywayVoiceResult49("+payload.toString()+")",null);}catch(Exception ignored){}
   }
  }else if(request==PICK_FILE){if(picker!=null){Uri[] files=null;if(result==RESULT_OK&&data!=null){if(data.getClipData()!=null){files=new Uri[data.getClipData().getItemCount()];for(int i=0;i<files.length;i++)files[i]=data.getClipData().getItemAt(i).getUri();}else if(data.getData()!=null)files=new Uri[]{data.getData()};}picker.onReceiveValue(files);picker=null;}}
  else if(request==SAVE_DOCUMENT){final String text=exportText;exportText=null;if(result==RESULT_OK&&data!=null&&data.getData()!=null&&text!=null){final Uri dest=data.getData();disk.execute(()->{boolean ok=false;try(OutputStream out=getContentResolver().openOutputStream(dest,"wt")){if(out!=null){out.write(text.getBytes(StandardCharsets.UTF_8));ok=true;}}catch(Exception ignored){}final boolean saved=ok;String receipt="";try{JSONObject meta=new JSONObject(text).optJSONObject("meta");if(meta!=null)receipt=meta.optString("clearReceipt55","");}catch(Exception ignored){}final String clearReceipt=receipt;runOnUiThread(()->Toast.makeText(this,saved?"Arquivo salvo no local escolhido.":"Não foi possível salvar o arquivo.",Toast.LENGTH_LONG).show());});}}
 }
 @Override public void onBackPressed(){if(customView!=null){web.getWebChromeClient().onHideCustomView();return;}if(web==null){finish();return;}web.evaluateJavascript("window.mywayBack41?window.mywayBack41():false",value->{if(!"true".equals(value))new AlertDialog.Builder(this).setTitle("Fechar MyWay?").setMessage("Seus dados já salvos ficam neste aparelho.").setPositiveButton("Fechar",(d,w)->{web.evaluateJavascript("window.mywayFlush41&&window.mywayFlush41()",v->finish());}).setNegativeButton("Continuar",null).show();});}
 @Override protected void onPause(){if(ads54!=null)ads54.pause();if(web!=null)web.evaluateJavascript("window.mywayFlush41&&window.mywayFlush41()",null);super.onPause();}
 @Override protected void onResume(){super.onResume();if(ads54!=null)ads54.resume();if(web!=null)web.evaluateJavascript("window.mywayAdsRefresh54&&window.mywayAdsRefresh54()",null);if(immersive)applyImmersive41(true);}
 @Override protected void onDestroy(){handler.removeCallbacksAndMessages(null);if(ads54!=null)ads54.destroy();if(picker!=null)picker.onReceiveValue(null);if(web!=null){web.destroy();web=null;}disk.shutdown();super.onDestroy();}
}
