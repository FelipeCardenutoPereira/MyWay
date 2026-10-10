package br.com.myway.pessoal;
import android.content.*;
public final class ReminderReceiver65 extends BroadcastReceiver {
 @Override public void onReceive(Context c,Intent i){if("br.com.myway.pessoal.REMINDER65".equals(i.getAction()))ReminderEngine65.fire(c);else ReminderEngine65.schedule(c);}
}
