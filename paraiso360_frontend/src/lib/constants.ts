export const APP_ROUTES = {
    STAFF_DASHBOARD: '/staff/dashboard',
    STAFF_CLIENTS: '/staff/clients',
    STAFF_CLIENT_DETAIL: (clientId: string) => `/staff/clients/${clientId}`,
    STAFF_LOT_INVENTORY: '/staff/lots/inventory',
    STAFF_LOT_MAP: '/staff/lots/map',
    STAFF_PAYMENTS: '/staff/payments',
    STAFF_DOCUMENTS: '/staff/documents',
    STAFF_REPORTS: '/staff/reports',
    // Add other staff routes here

    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_AUDIT_TRAIL: '/admin/audit-trail',
    ADMIN_SETTINGS: '/admin/settings',
    // Add other admin routes here

    LOGIN: '/auth/login',
    PUBLIC_WAYFINDING: '/public/wayfinding',
};

export const USER_ROLES = {
    ADMIN: 'admin',
    STAFF: 'staff',
};

export const PLOT_STATUSES = {
    AVAILABLE: 'Available',
    RESERVED: 'Reserved',
    OCCUPIED: 'Occupied',
    MAINTENANCE: 'Maintenance',
} as const;

export type PlotStatus = typeof PLOT_STATUSES[keyof typeof PLOT_STATUSES];

export const DOCUMENT_TYPES = {
    CONTRACT: 'Contract',
    DEED_OF_SALE: 'Deed of Sale',
    PAYMENT_RECEIPT: 'Payment Receipt',
    INTERMENT_ORDER: 'Interment Order',
    CLIENT_ID: 'Client Identification',
    PLOT_MAP: 'Plot Map/Layout',
    OTHER: 'Other',
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];

export const PAYMENT_TYPES = {
    DOWNPAYMENT: 'Downpayment',
    FULL_PAYMENT: 'Full Payment',
    INSTALLMENT: 'Installment',
    RESERVATION_FEE: 'Reservation Fee',
    MAINTENANCE_FEE: 'Maintenance Fee',
    INTERMENT_FEE: 'Interment Fee',
    EXHUMATION_FEE: 'Exhumation Fee',
    TRANSFER_FEE: 'Transfer Fee',
    OTHER: 'Other',
} as const;

export const PAYMENT_STATUSES = {
    PAID: 'Paid',
    PENDING: 'Pending',
    OVERDUE: 'Overdue',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
} as const;

export const REPORT_TYPES = {
    CLIENT_MASTERLIST: {
        id: 'client_masterlist',
        title: 'Client Masterlist',
        description: 'A comprehensive list of all registered clients and their basic information.',
        // requiredRoles: [USER_ROLES.STAFF, USER_ROLES.ADMIN], // Example for future role-based access
    },
    LOT_OCCUPANCY: {
        id: 'lot_occupancy',
        title: 'Lot Occupancy Report',
        description: 'Shows the status of all lots (Available, Reserved, Occupied).',
    },
    PAYMENT_COLLECTION: {
        id: 'payment_collection',
        title: 'Payment Collection Summary',
        description: 'Summarizes payments collected over a specified period.',
    },
    AVAILABLE_LOTS: {
        id: 'available_lots',
        title: 'Available Lots Listing',
        description: 'Lists all lots currently marked as available for sale or reservation.',
    },
    INTERMENT_SCHEDULE: {
        id: 'interment_schedule',
        title: 'Interment Schedule',
        description: 'Upcoming and past interment schedules.',
        // requiredRoles: [USER_ROLES.ADMIN], // Example if some reports are admin-only
    },
    // Add more report types as planned
} as const;

export type ReportTypeId = typeof REPORT_TYPES[keyof typeof REPORT_TYPES]['id'];
export type ReportDefinition = typeof REPORT_TYPES[keyof typeof REPORT_TYPES];

// Other constants can be added here 