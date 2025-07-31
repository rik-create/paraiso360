// Types for Paraiso360 mock data

export type UserRole = 'staff' | 'admin';
export type UserStatus = 'active' | 'inactive';

export interface User {
    id: string;
    username: string;
    fullName: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastLogin?: Date;
}

export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    alternativeContactNumber?: string;
    email?: string;
    address: string;
    registrationDate: Date;
    associatedPlotIds: string[];
    notes?: string;
}

export interface Plot {
    id: string;
    section: string;
    blockNumber: string;
    lotNumber: string;
    type: string;
    status: string;
    capacity: number;
    dimensions?: string;
    ownerClientId?: string;
    reservationDate?: Date;
    purchaseDate?: Date;
    interredPersons?: InterredPerson[];
    notes?: string;
}

export interface InterredPerson {
    name: string;
    dateOfBirth: Date;
    dateOfDeath: Date;
    dateOfInterment: Date;
}

// Add PaymentType and PaymentStatus
export type PaymentType = 'Downpayment' | 'Full Payment' | 'Installment' | 'Reservation Fee' | 'Maintenance Fee' | 'Interment Fee' | 'Exhumation Fee' | 'Transfer Fee' | 'Other';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Cancelled' | 'Refunded';

export interface Payment {
    id: string;
    clientId: string;
    clientName?: string;
    plotId?: string;
    plotIdentifier?: string;
    amount: number;
    paymentDate: Date;
    orNumber: string;
    paymentType: PaymentType;
    method: 'Cash' | 'Bank Transfer' | 'Check' | 'GCash' | 'Credit Card' | string;
    status: PaymentStatus;
    notes?: string;
    recordedByUserId?: string;
    recordedByUsername?: string;
}

export interface DocumentRecord {
    id: string;
    fileName: string;
    fileType: string;
    uploadDate: Date;
    uploadedByUserId: string;
    clientId?: string;
    plotId?: string;
    description?: string;
    filePath: string;
    tags?: string[];
    uploadedByUsername?: string;
    clientName?: string;
    plotIdentifier?: string;
}

export interface AuditLog {
    id: string;
    timestamp: Date;
    userId: string;
    username: string;
    actionPerformed: string;
    details: string;
    affectedTable: string;
    affectedRecordId: string;
    oldValue?: string;
    newValue?: string;
}

// UI Related Types
export interface BreadcrumbItem {
    label: string;
    href?: string; // Optional: if the breadcrumb item is a link
} 