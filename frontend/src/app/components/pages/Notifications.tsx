import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

const NOTIF_EMOJI: Record<string, string> = {
  verification: '🎉',
  issue_confirmed: '🏗️',
  progress_update: '🚧',
  default: '🔔',
};

const NOTIF_GLASS: Record<string, string> = {
  verification: 'glass-badge-success',
  issue_confirmed: 'glass-badge-accent',
  progress_update: 'glass-badge-warning',
  default: 'glass-badge-primary',
};

export function Notifications() {
  const { user, notifications: systemNotifications, markNotificationsRead } = useAuth();

  const userNotifications = systemNotifications.filter(
    n => !user || n.userId === user.id || n.userId === 'all'
  );

  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    markNotificationsRead();
  }, []);

  const activeNotifications = userNotifications.filter(n => !dismissedIds.includes(n.id));

  return (
    <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto text-left">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Notifications
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time alerts for verification, issue confirmation & field updates
          </p>
        </div>
        {activeNotifications.length > 0 && (
          <span className="glass-badge glass-badge-danger animate-glow">
            {activeNotifications.length} new
          </span>
        )}
      </div>

      {activeNotifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card flex flex-col items-center justify-center py-16 text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.20)' }}
          >
            <Bell size={28} className="text-blue-500" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">All Caught Up!</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            You'll receive instant notifications here when your resident identity is verified,
            or when Field Officers confirm & update your civic reports.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {activeNotifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="glass-card p-4 flex items-start gap-3.5 relative"
                whileHover={{ y: -2 }}
              >
                {/* Icon */}
                <div
                  className={`glass-badge ${NOTIF_GLASS[notif.type] || NOTIF_GLASS.default} w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border`}
                  style={{ fontSize: '1.2rem', padding: '0.5rem' }}
                >
                  {NOTIF_EMOJI[notif.type] || NOTIF_EMOJI.default}
                </div>

                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-sm font-bold text-foreground mb-0.5">{notif.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground/60 mt-1.5">{notif.createdAt}</p>
                </div>

                {/* Unread dot */}
                {!notif.read && (
                  <div className="absolute top-4 right-10 w-2 h-2 rounded-full bg-blue-500 animate-glow" />
                )}

                {/* Dismiss */}
                <button
                  onClick={() => setDismissedIds([...dismissedIds, notif.id])}
                  className="absolute top-3 right-3 glass-btn-icon p-1 rounded-lg"
                  aria-label="Dismiss notification"
                >
                  <X size={13} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
