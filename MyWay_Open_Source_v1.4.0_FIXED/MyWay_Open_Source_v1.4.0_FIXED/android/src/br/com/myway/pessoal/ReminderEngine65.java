package br.com.myway.pessoal;
import android.app.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.os.Build;
import org.json.*;
import java.util.*;

public final class ReminderEngine65 {
 private static final String PREF="myway-reminders65",CHANNEL="myway-routine65",QUIET="myway-routine65-quiet";
 static android.content.SharedPreferences prefs(Context c){return c.getSharedPreferences(PREF,0);}
 static JSONObject plan(Context c){try{return new JSONObject(prefs(c).getString("plan","{}"));}catch(Exception e){return new JSONObject();}}
 static boolean allowed(Context c){return ((NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE)).areNotificationsEnabled()&&(Build.VERSION.SDK_INT<33||c.checkSelfPermission("android.permission.POST_NOTIFICATIONS")==PackageManager.PERMISSION_GRANTED);}
 public static JSONObject info(Context c)throws JSONException{AlarmManager a=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);return new JSONObject().put("ok",true).put("enabled",prefs(c).getBoolean("enabled",false)).put("permission",allowed(c)).put("exact",Build.VERSION.SDK_INT<31||a.canScheduleExactAlarms()).put("sdk",Build.VERSION.SDK_INT);}
 public static void enable(Context c,boolean on){prefs(c).edit().putBoolean("enabled",on).apply();if(!on)((NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE)).cancelAll();schedule(c);}
 public static void sync(Context c,JSONObject next){String owner=plan(c).optString("owner");if(!owner.equals(next.optString("owner")))((NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE)).cancelAll();prefs(c).edit().putString("plan",next.toString()).apply();schedule(c);}
 static PendingIntent tick(Context c){return PendingIntent.getBroadcast(c,65,new Intent(c,ReminderReceiver65.class).setAction("br.com.myway.pessoal.REMINDER65"),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);}
 public static void schedule(Context c){
  try{AlarmManager alarm=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);PendingIntent pi=tick(c);alarm.cancel(pi);JSONObject p=plan(c);if(!prefs(c).getBoolean("enabled",false)||!allowed(c)||p.optString("owner").isEmpty())return;
   JSONArray rules=p.optJSONArray("rules");if(rules==null)return;long now=System.currentTimeMillis(),soonest=Long.MAX_VALUE;for(int i=0;i<Math.min(rules.length(),100);i++){JSONObject r=rules.optJSONObject(i);if(r!=null)soonest=Math.min(soonest,next(r,now));}if(soonest==Long.MAX_VALUE)return;
   if(Build.VERSION.SDK_INT<31||alarm.canScheduleExactAlarms())alarm.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,soonest,pi);else alarm.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,soonest,pi);
  }catch(Exception ignored){}
 }
 static boolean includes(JSONArray a,int value){if(a==null)return false;for(int i=0;i<a.length();i++)if(a.optInt(i,-1)==value)return true;return false;}
 static String date(Calendar c){return String.format(Locale.US,"%04d-%02d-%02d",c.get(Calendar.YEAR),c.get(Calendar.MONTH)+1,c.get(Calendar.DAY_OF_MONTH));}
 static boolean matches(JSONObject r,Calendar c){String d=date(c),start=r.optString("start"),end=r.optString("end");if(!start.isEmpty()&&d.compareTo(start)<0||!end.isEmpty()&&d.compareTo(end)>0)return false;JSONArray skips=r.optJSONArray("skipDates");if(skips!=null)for(int i=0;i<skips.length();i++)if(d.equals(skips.optString(i)))return false;
  return "monthly".equals(r.optString("cadence"))?c.get(Calendar.DAY_OF_MONTH)==Math.min(Math.max(1,r.optInt("monthDay",1)),c.getActualMaximum(Calendar.DAY_OF_MONTH)):includes(r.optJSONArray("days"),c.get(Calendar.DAY_OF_WEEK)-1);
 }
 static long next(JSONObject r,long after){String time=r.optString("time");if(!time.matches("(?:[01][0-9]|2[0-3]):[0-5][0-9]"))return Long.MAX_VALUE;Calendar day=Calendar.getInstance();day.setTimeInMillis(after);day.set(Calendar.HOUR_OF_DAY,12);day.set(Calendar.MINUTE,0);day.set(Calendar.SECOND,0);day.set(Calendar.MILLISECOND,0);
  for(int i=0;i<370;i++,day.add(Calendar.DAY_OF_MONTH,1)){if(!matches(r,day))continue;Calendar target=(Calendar)day.clone();target.set(Calendar.HOUR_OF_DAY,Integer.parseInt(time.substring(0,2)));target.set(Calendar.MINUTE,Integer.parseInt(time.substring(3)));long when=target.getTimeInMillis();if(when>after)return when;}return Long.MAX_VALUE;
 }
 public static void fire(Context c){try{JSONObject p=plan(c);if(!prefs(c).getBoolean("enabled",false)||!allowed(c)||p.optString("owner").isEmpty())return;JSONArray rules=p.optJSONArray("rules");if(rules==null)return;long now=System.currentTimeMillis();JSONObject receipts=new JSONObject(prefs(c).getString("receipts","{}"));Iterator<String> keys=receipts.keys();ArrayList<String> stale=new ArrayList<>();while(keys.hasNext()){String k=keys.next();if(receipts.optLong(k)<now-86400000L*90)stale.add(k);}for(String k:stale)receipts.remove(k);
  for(int i=0;i<rules.length();i++){JSONObject r=rules.optJSONObject(i);if(r==null)continue;long due=next(r,now-12*3600000L);if(due>now||due==Long.MAX_VALUE)continue;String key=p.optString("owner")+"|"+r.optString("id")+"|"+due;if(receipts.has(key))continue;receipts.put(key,due);notify(c,r.optString("title","Sua tarefa"),p.optBoolean("silent"),key.hashCode());}
  prefs(c).edit().putString("receipts",receipts.toString()).apply();
 }catch(Exception ignored){}finally{schedule(c);}}
 private static void channels(Context c){NotificationManager n=(NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE);NotificationChannel normal=new NotificationChannel(CHANNEL,"Horários das rotinas",NotificationManager.IMPORTANCE_DEFAULT);n.createNotificationChannel(normal);NotificationChannel quiet=new NotificationChannel(QUIET,"Lembretes sem som",NotificationManager.IMPORTANCE_DEFAULT);quiet.setSound(null,null);quiet.enableVibration(false);n.createNotificationChannel(quiet);}
 private static void notify(Context c,String title,boolean silent,int id){channels(c);Intent open=new Intent(c,ReminderActivity65.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);PendingIntent content=PendingIntent.getActivity(c,id,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);Notification notification=new Notification.Builder(c,silent?QUIET:CHANNEL).setSmallIcon(android.R.drawable.ic_popup_reminder).setContentTitle("MyWay · horário da tarefa").setContentText(title).setStyle(new Notification.BigTextStyle().bigText(title)).setContentIntent(content).setAutoCancel(true).build();((NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE)).notify(id,notification);}
 public static boolean test(Context c){if(!prefs(c).getBoolean("enabled",false)||!allowed(c))return false;notify(c,"Os lembretes estão funcionando neste aparelho.",plan(c).optBoolean("silent"),65);return true;}
}
