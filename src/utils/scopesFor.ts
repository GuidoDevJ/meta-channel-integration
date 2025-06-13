export const scopesFor = (
  type: 'whatsapp' | 'instagram' | 'facebook'
): string[] => {
  switch (type) {
    case 'whatsapp':
      return ['whatsapp_business_messaging', 'whatsapp_business_management'];
    case 'instagram':
      return [
        'instagram_basic',
        'instagram_manage_messages',
        'pages_show_list',
      ];
    default:
      return ['pages_messaging', 'pages_manage_metadata', 'pages_show_list'];
  }
};
