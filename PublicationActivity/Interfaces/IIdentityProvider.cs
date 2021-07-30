using PublicationActivity.Models.User;

namespace PublicationActivity.Interfaces
{
    public interface IIdentityProvider
    {
        UserInfo GetUserInfo();
    }
}
