import type { Client, Plot, Payment, DocumentRecord, User, AuditLog } from '@/types/paraiso';
import { generateId, formatDate } from './utils';

// --- USERS ---
export const mockUsers: User[] = [
    {
        id: generateId('user'),
        username: 'staff01',
        fullName: 'Staff Member One',
        email: 'staff01@paraiso.local',
        role: 'staff',
        status: 'active',
        lastLogin: new Date('2024-05-20T10:00:00Z'),
    },
    {
        id: generateId('user'),
        username: 'admin01',
        fullName: 'Administrator One',
        email: 'admin01@paraiso.local',
        role: 'admin',
        status: 'active',
        lastLogin: new Date('2024-05-21T09:30:00Z'),
    },
    {
        id: generateId('user'),
        username: 'staff02',
        fullName: 'Staff Member Two',
        email: 'staff02@paraiso.local',
        role: 'staff',
        status: 'inactive',
    }
];

// --- CLIENTS ---
export const mockClients: Client[] = [
    {
        id: generateId('client'),
        firstName: 'ClientA',
        lastName: 'Family',
        contactNumber: '09170000001',
        alternativeContactNumber: '09200000001',
        email: 'client.a.family@email.local',
        address: '123 Main St, Metro City',
        registrationDate: new Date('2023-01-15T00:00:00Z'),
        associatedPlotIds: ['plot_S1P01_001', 'plot_S2P02_005'],
        notes: 'Long-time client account. Prefers communication via email.',
    },
    {
        id: generateId('client'),
        firstName: 'ClientB',
        lastName: 'Group',
        contactNumber: '09180000002',
        email: 'client.b.group@email.local',
        address: '456 Oak Avenue, Metro City',
        registrationDate: new Date('2022-11-20T00:00:00Z'),
        associatedPlotIds: ['plot_S3P01_010'],
        notes: 'Paid in full for plot S3P01-010.',
    },
    {
        id: generateId('client'),
        firstName: 'New',
        lastName: 'Inquirer',
        contactNumber: '09150000003',
        address: '789 Pine Boulevard, Metro City',
        registrationDate: new Date('2024-03-01T00:00:00Z'),
        associatedPlotIds: [],
        notes: 'Inquired about standard lots, potential new account.',
    },
];

// --- PLOTS ---
export const mockPlots: Plot[] = [
    {
        id: 'plot_S1P01_001',
        section: 'Section 1',
        blockNumber: 'Plot Block 01',
        lotNumber: '001',
        type: 'Gold',
        status: 'Occupied',
        capacity: 2,
        dimensions: '1m x 2.5m',
        ownerClientId: mockClients[0].id,
        purchaseDate: new Date('2022-12-01T00:00:00Z'),
        interredPersons: [
            { name: 'Deceased One', dateOfBirth: new Date('1950-06-10'), dateOfDeath: new Date('2022-12-20'), dateOfInterment: new Date('2022-12-24') }
        ],
        notes: 'Located near the main garden area.',
    },
    {
        id: 'plot_S2P02_005',
        section: 'Section 2',
        blockNumber: 'Plot Block 02',
        lotNumber: '005',
        type: 'Platinum',
        status: 'Reserved',
        capacity: 4,
        dimensions: '2.5m x 2.5m',
        ownerClientId: mockClients[0].id,
        reservationDate: new Date('2024-04-10T00:00:00Z'),
        notes: 'Reservation valid until ' + formatDate(new Date(new Date('2024-04-10T00:00:00Z').setDate(new Date('2024-04-10T00:00:00Z').getDate() + 30))),
    },
    {
        id: 'plot_S3P01_010',
        section: 'Section 3',
        blockNumber: 'Plot Block 01',
        lotNumber: '010',
        type: 'Gold',
        status: 'Occupied',
        capacity: 1,
        ownerClientId: mockClients[1].id,
        purchaseDate: new Date('2021-09-15T00:00:00Z'),
        interredPersons: [
            { name: 'Deceased Two', dateOfBirth: new Date('1945-02-15'), dateOfDeath: new Date('2021-10-05'), dateOfInterment: new Date('2021-10-10') }
        ],
    },
    {
        id: generateId('plot'),
        section: 'Section 4',
        blockNumber: 'Plot Block 05',
        lotNumber: '012',
        type: 'Gold',
        status: 'Available',
        capacity: 2,
        dimensions: '1m x 2.5m',
    },
];

// --- PAYMENTS ---
export const mockPayments: Payment[] = [
    {
        id: generateId('pay'),
        clientId: mockClients[0].id,
        clientName: `${mockClients[0].firstName} ${mockClients[0].lastName}`,
        plotId: 'plot_S1P01_001',
        plotIdentifier: `S1-P01-001`,
        amount: 50000,
        paymentDate: new Date('2023-01-15T00:00:00Z'),
        orNumber: 'OR' + Math.floor(Math.random() * 90000 + 10000),
        paymentType: 'Full Payment',
        method: 'Bank Transfer',
        status: 'Paid',
        notes: 'Full payment for plot S1P01-001.',
        recordedByUserId: mockUsers[0].id,
        recordedByUsername: mockUsers[0].username,
    },
    {
        id: generateId('pay'),
        clientId: mockClients[1].id,
        clientName: `${mockClients[1].firstName} ${mockClients[1].lastName}`,
        plotId: 'plot_S3P01_010',
        plotIdentifier: `S3-P01-010`,
        amount: 25000,
        paymentDate: new Date('2022-11-20T00:00:00Z'),
        orNumber: 'OR' + Math.floor(Math.random() * 90000 + 10000),
        paymentType: 'Full Payment',
        method: 'Cash',
        status: 'Paid',
        recordedByUserId: mockUsers[0].id,
        recordedByUsername: mockUsers[0].username,
    },
    {
        id: generateId('pay'),
        clientId: mockClients[0].id,
        clientName: `${mockClients[0].firstName} ${mockClients[0].lastName}`,
        plotId: 'plot_S2P02_005',
        plotIdentifier: `S2-P02-005`,
        amount: 5000,
        paymentDate: new Date('2024-04-10T00:00:00Z'),
        orNumber: 'OR' + Math.floor(Math.random() * 90000 + 10000),
        paymentType: 'Reservation Fee',
        method: 'GCash',
        status: 'Paid',
        notes: 'Reservation for Garden Lot S2P02-005',
        recordedByUserId: mockUsers[0].id,
        recordedByUsername: mockUsers[0].username,
    },
    {
        id: generateId('pay'),
        clientId: mockClients[0].id,
        clientName: `${mockClients[0].firstName} ${mockClients[0].lastName}`,
        amount: 1000,
        paymentDate: new Date('2024-05-10T00:00:00Z'),
        orNumber: 'OR' + Math.floor(Math.random() * 90000 + 10000),
        paymentType: 'Other',
        method: 'Cash',
        status: 'Paid',
        notes: 'General park usage fee.',
        recordedByUserId: mockUsers[0].id,
        recordedByUsername: mockUsers[0].username,
    }
];

// --- DOCUMENTS ---
export const mockDocuments: DocumentRecord[] = [
    {
        id: generateId('doc'),
        fileName: 'ClientA_Contract_S1P01-001.pdf',
        fileType: 'application/pdf',
        uploadDate: new Date('2023-01-16T00:00:00Z'),
        uploadedByUserId: mockUsers[0].id,
        clientId: mockClients[0].id,
        plotId: 'plot_S1P01_001',
        description: 'Contract of Sale for Client A, Plot S1P01-001.',
        filePath: '/documents/mock_contract_01.pdf',
    },
    {
        id: generateId('doc'),
        fileName: 'ClientB_DeedOfSale_S3P01-010.docx',
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadDate: new Date('2022-11-21T00:00:00Z'),
        uploadedByUserId: mockUsers[0].id,
        clientId: mockClients[1].id,
        plotId: 'plot_S3P01_010',
        description: 'Deed of Sale for Client B.',
        filePath: '/documents/mock_deed_02.docx',
    },
    {
        id: generateId('doc'),
        fileName: 'Plot_Layout_Section_1.png',
        fileType: 'image/png',
        uploadDate: new Date('2022-01-01T00:00:00Z'),
        uploadedByUserId: mockUsers[1].id,
        description: 'Map layout for Section 1.',
        filePath: '/documents/mock_layout_S1.png',
    }
];

// --- AUDIT LOGS ---
export const mockAuditLogs: AuditLog[] = [
    {
        id: generateId('audit'),
        timestamp: new Date('2024-05-21T09:30:05Z'),
        userId: mockUsers[1].id,
        username: mockUsers[1].username,
        actionPerformed: 'User Login',
        details: `${mockUsers[1].username} logged in successfully.`,
        affectedTable: 'Users',
        affectedRecordId: mockUsers[1].id,
    },
    {
        id: generateId('audit'),
        timestamp: new Date('2024-05-20T10:05:00Z'),
        userId: mockUsers[0].id,
        username: mockUsers[0].username,
        actionPerformed: 'Create Client Record',
        details: `Created new client: ${mockClients[2].firstName} ${mockClients[2].lastName}`,
        affectedTable: 'Clients',
        affectedRecordId: mockClients[2].id,
    },
    {
        id: generateId('audit'),
        timestamp: new Date('2024-05-20T11:15:30Z'),
        userId: mockUsers[0].id,
        username: mockUsers[0].username,
        actionPerformed: 'Update Plot Status',
        details: `Plot ${mockPlots[1].id} status changed from Available to Reserved.`,
        affectedTable: 'Plots',
        affectedRecordId: mockPlots[1].id,
        oldValue: JSON.stringify({ status: 'Available' }),
        newValue: JSON.stringify({ status: 'Reserved', ownerClientId: mockClients[0].id }),
    }
];

// Helper functions for data retrieval
export const getClientById = (id: string): Client | undefined => mockClients.find(c => c.id === id);
export const getPlotById = (id: string): Plot | undefined => mockPlots.find(p => p.id === id);
export const getUserById = (id: string): User | undefined => mockUsers.find(u => u.id === id);
export const getPaymentsByClientId = (clientId: string): Payment[] => mockPayments.filter(p => p.clientId === clientId);
export const getDocumentsByClientId = (clientId: string): DocumentRecord[] => mockDocuments.filter(d => d.clientId === clientId);
export const getPlotsByOwnerId = (ownerId: string): Plot[] => mockPlots.filter(p => p.ownerClientId === ownerId);
export const getPaymentById = (id: string): Payment | undefined => mockPayments.find(p => p.id === id); 