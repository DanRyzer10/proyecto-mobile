import { MOODLE_REST_FORMAT, MOODLE_TOKEN } from "@/constants"

export const  functionMap = {
    get_site_info: 'core_webservice_get_site_info',
    create_users: 'core_user_create_users',
    get_user_by_field:'core_user_get_users_by_field'
}

export const defaultParams = {
    moodlewsrestformat: MOODLE_REST_FORMAT,
    wstoken: MOODLE_TOKEN,
}