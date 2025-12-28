export interface CreateMoodleUserInput {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  auth?: MoodleAuthMethod;
  idnumber?: string;
  timezone?: string;
  lang?: string;
  calendartype?: MoodleCalendarType;
  theme?: string;
  mailformat?: MoodleMailFormat;
  description?: string;
  city?: string;
  country?: string;
  phone1?: string;
  phone2?: string;
  institution?: string;
  department?: string;

  preferences?: MoodleUserPreference[];
  
  customfields?: MoodleCustomField[];
}

export interface MoodleUserPreference {
  type: string;
  value: string | number;
}

export const CommonPreferences = {
  AUTH_FORCE_PASSWORD_CHANGE: 'auth_forcepasswordchange',
  EMAIL_STOP: 'message_provider_moodle_instantmessage_email',
  FORUM_AUTO_SUBSCRIBE: 'forum_autosubscribe',
  FORUM_TRACK_READ: 'forum_trackreadposts',
} as const;

export type MoodleAuthMethod = 'manual' | 'oauth2' | 'email' | 'ldap' | 'cas';
export type MoodleMailFormat = 0 | 1; // 0 = texto plano, 1 = HTML
export type MoodleCalendarType = 'gregorian' | 'hijri' | 'hebrew';


export interface MoodleCustomField {
  type: string;
  value: string;
}