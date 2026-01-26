<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";
</style>


<script>
import { initRouterGuard } from '@/authentication/routerGuard';
import authentication from '@/authentication';

export default {
  onLaunch: function () {
    // console.log('App Launch')

    initRouterGuard();
    authentication.syncUserData();
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
</style>
