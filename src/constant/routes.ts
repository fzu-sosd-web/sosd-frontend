import RecruitDetail from '@/views/recruit/detail'

const BASE_ROUTE_PATH = 'SOSD'
export const RoutePath = {
  /**登录 */
  Login: `/login`,
  /**注册 */
  Register: `/register`,
  /**主页 */
  Home: `/home`,
  /**关于我们 */
  AboutUs: `/about-us`,
  /**加入我们 */
  JoinUs: `/join-us`,
  /**个人中心 */
  Profile: `/profile`,
  /**管理端 */
  Admin: `/admin`,
  /**服创校赛详情 */
  Competition: `/competition/:competitionId`,
  /**竞赛列表 */
  CompetitionList: `/comp_list`,
  /**SSO登录 */
  SSOLogin: `/sso/session`,
  /**纳新 */
  Recruit: `/recruit`,
  /**纳新详情 */
  RecruitDetail: `/recruit/:recruitId`,
  /**管理端纳新管理 */
  AdminRecruit: '/admin/recruit',
  /**管理端纳新详情 */
  AdminRecruitDetail: '/admin/recruit/:adminRecruitId',
  /**管理端竞赛管理 */
  AdminCompetition: '/admin/competition',
  /**管理端用户管理 */
  AdminAccount: '/admin/account',
}
