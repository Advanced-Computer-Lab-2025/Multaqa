import { UserRole, UserStatus } from '../constants/user.constants';
import { EVENT_TYPES } from '../constants/events.constants';
import { StaffPosition } from '../constants/staffMember.constants';
import { AdministrationRoleType } from '../constants/administration.constants';
import { Event_Request_Status } from '../constants/user.constants';

describe('Backend API Tests - Constants and Enums', () => {
  // Test 1: User Role Validation
  it('should validate user roles are defined correctly', () => {
    expect(UserRole.STUDENT).toBe('student');
    expect(UserRole.STAFF_MEMBER).toBe('staffMember');
    expect(UserRole.VENDOR).toBe('vendor');
    expect(UserRole.ADMINISTRATION).toBe('administration');
    
    // Ensure all roles are strings
    Object.values(UserRole).forEach(role => {
      expect(typeof role).toBe('string');
    });
  });

  // Test 2: Event Type Validation
  it('should validate all event types exist', () => {
    const eventTypes = Object.values(EVENT_TYPES);
    
    expect(eventTypes).toContain('trip');
    expect(eventTypes).toContain('conference');
    expect(eventTypes).toContain('workshop');
    expect(eventTypes).toContain('bazaar');
    expect(eventTypes).toContain('platform_booth');
    
    // Ensure we have at least 5 event types
    expect(eventTypes.length).toBeGreaterThanOrEqual(5);
  });

  // Test 3: Staff Position Validation
  it('should validate staff positions are correct', () => {
    expect(StaffPosition.PROFESSOR).toBe('professor');
    expect(StaffPosition.TA).toBe('TA'); // TA is uppercase
    expect(StaffPosition.STAFF).toBe('staff');
    
    const positions = Object.values(StaffPosition);
    expect(positions.length).toBeGreaterThanOrEqual(3);
  });

  // Test 4: User Status Validation
  it('should validate user status values', () => {
    expect(UserStatus.ACTIVE).toBe('active');
    expect(UserStatus.BLOCKED).toBe('blocked');
    
    // Ensure there are exactly 2 statuses
    const statuses = Object.values(UserStatus);
    expect(statuses).toHaveLength(2);
  });

  // Test 5: Event Request Status Workflow
  it('should validate event request status workflow states', () => {
    expect(Event_Request_Status.PENDING).toBe('pending');
    expect(Event_Request_Status.AWAITING_REVIEW).toBe('awaiting_review');
    expect(Event_Request_Status.APPROVED).toBe('approved');
    expect(Event_Request_Status.REJECTED).toBe('rejected');
    
    // Ensure workflow has all necessary states
    const workflow = Object.values(Event_Request_Status);
    expect(workflow).toContain('pending');
    expect(workflow).toContain('approved');
    expect(workflow).toContain('rejected');
    expect(workflow.length).toBe(4);
  });
});
