export default function getNotificationLink(notification) {
  const { type, metadata, link } = notification;

  if (link) return link;

  switch (type) {
    case "application_status":
    case "application_submitted":
      return "/applications";

    case "job_posted":
    case "job_deleted":
      return metadata?.jobId ? `/job/${metadata.jobId}` : null;

    case "message":
      return metadata?.threadId ? `/message/${metadata.threadId}` : "/messages";

    case "resume_viewed":
    case "friend_request":
    case "account_blocked":
    case "account_unblocked":
      return metadata?.userId ? `/profile/${metadata.userId}` : null;

    case "site_update":
    case "admin_delete":
      return "/notifications";

    default:
      return null;
  }
}
