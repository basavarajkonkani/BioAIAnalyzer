# Manual Testing Checklist

This document provides a comprehensive checklist for manual testing of the BioAI Analyzer Frontend application.

## Test Environment Setup

- [ ] Application is running on `http://localhost:3000`
- [ ] Backend API is accessible and running
- [ ] Browser DevTools console is open to monitor errors
- [ ] Test with multiple browsers (Chrome, Firefox, Safari)
- [ ] Test with different screen sizes (mobile, tablet, desktop)

## 1. Complete User Workflow Testing

### 1.1 Registration Flow
- [ ] Navigate to `/register`
- [ ] Verify all form fields are present (Name, Email, Password, Confirm Password)
- [ ] Test validation:
  - [ ] Submit empty form - should show validation errors
  - [ ] Enter name less than 2 characters - should show error
  - [ ] Enter invalid email format - should show error
  - [ ] Enter password less than 8 characters - should show error
  - [ ] Enter mismatched passwords - should show error
- [ ] Submit valid registration data
- [ ] Verify success message appears
- [ ] Verify redirect to login page after 2 seconds

### 1.2 Login Flow
- [ ] Navigate to `/login`
- [ ] Verify all form fields are present (Email, Password)
- [ ] Test validation:
  - [ ] Submit empty form - should show validation errors
  - [ ] Enter invalid email format - should show error
  - [ ] Enter password less than 8 characters - should show error
- [ ] Submit valid login credentials
- [ ] Verify success message appears
- [ ] Verify redirect to dashboard
- [ ] Verify user name appears in navbar

### 1.3 DNA Sequence Analysis
- [ ] Navigate to `/dashboard`
- [ ] Verify DNA tab is selected by default
- [ ] Enter valid DNA sequence (e.g., "ATGCATGCATGC")
- [ ] Verify character count updates
- [ ] Click "Analyze" button
- [ ] Verify loading spinner appears
- [ ] Verify results display:
  - [ ] GC content percentage
  - [ ] Nucleotide counts table
  - [ ] Bar chart visualization
  - [ ] Pie chart visualization
- [ ] Test invalid sequence:
  - [ ] Enter sequence with invalid characters (e.g., "ATGCX")
  - [ ] Verify error message appears

### 1.4 RNA Sequence Analysis
- [ ] Click RNA tab
- [ ] Enter valid RNA sequence (e.g., "AUGCAUGCAUGC")
- [ ] Verify character count updates
- [ ] Click "Analyze" button
- [ ] Verify results display correctly
- [ ] Test invalid sequence with DNA characters (T instead of U)
- [ ] Verify error message appears

### 1.5 Protein Sequence Analysis
- [ ] Click Protein tab
- [ ] Enter valid protein sequence (e.g., "ACDEFGHIKLMNPQRSTVWY")
- [ ] Verify character count updates
- [ ] Click "Analyze" button
- [ ] Verify results display correctly
- [ ] Test invalid sequence with non-amino acid characters
- [ ] Verify error message appears

### 1.6 File Upload Analysis
- [ ] Navigate to file upload section
- [ ] Test drag and drop:
  - [ ] Drag a valid .fasta file
  - [ ] Verify drop zone highlights
  - [ ] Drop file
  - [ ] Verify file name and size display
- [ ] Test file selection:
  - [ ] Click upload area
  - [ ] Select valid .fasta file
  - [ ] Verify file name and size display
- [ ] Test invalid file:
  - [ ] Upload .txt file
  - [ ] Verify error message: "Unsupported file format"
- [ ] Test large file:
  - [ ] Upload file > 10MB
  - [ ] Verify error message: "File size exceeds 10MB limit"
- [ ] Test all supported formats:
  - [ ] .fasta file
  - [ ] .fa file
  - [ ] .gb file
  - [ ] .gbk file
- [ ] Click "Analyze" button with uploaded file
- [ ] Verify results display correctly

### 1.7 History Page
- [ ] Navigate to `/history`
- [ ] Verify list of previous analyses displays
- [ ] Verify each item shows:
  - [ ] Sequence type
  - [ ] Input preview (first 20 characters)
  - [ ] Timestamp in "YYYY-MM-DD HH:MM:SS" format
  - [ ] "View Details" button
- [ ] Click "View Details" on an item
- [ ] Verify full analysis results display
- [ ] Test pagination (if more than 20 items)
- [ ] Test empty state (clear history if possible)
- [ ] Verify "No analysis history" message appears

### 1.8 About Page
- [ ] Navigate to `/about`
- [ ] Verify project overview section
- [ ] Verify Biopython citation is present and correctly formatted
- [ ] Verify technology stack list includes:
  - [ ] React.js
  - [ ] Tailwind CSS
  - [ ] FastAPI
  - [ ] Biopython

### 1.9 Logout Flow
- [ ] Click logout button in navbar
- [ ] Verify redirect to login page
- [ ] Verify user is logged out (token removed)
- [ ] Try to access `/dashboard` directly
- [ ] Verify redirect to login page

## 2. Responsive Design Testing

### 2.1 Mobile (< 768px)
- [ ] Test on viewport width 320px
- [ ] Test on viewport width 375px (iPhone)
- [ ] Test on viewport width 414px (iPhone Plus)
- [ ] Verify navbar:
  - [ ] Hamburger menu appears
  - [ ] Menu items stack vertically
  - [ ] Logo is visible
- [ ] Verify dashboard:
  - [ ] Tabs stack properly
  - [ ] Input area is full width
  - [ ] File upload area is readable
  - [ ] Results display in single column
  - [ ] Charts are responsive
- [ ] Verify forms:
  - [ ] All fields are accessible
  - [ ] Buttons are full width
  - [ ] Text is readable (min 14px)
- [ ] Verify history:
  - [ ] Items stack vertically
  - [ ] Timestamps wrap properly
  - [ ] Buttons are accessible

### 2.2 Tablet (768px - 1024px)
- [ ] Test on viewport width 768px (iPad)
- [ ] Test on viewport width 1024px (iPad Pro)
- [ ] Verify layout adapts properly
- [ ] Verify charts display at appropriate size
- [ ] Verify navigation is accessible

### 2.3 Desktop (> 1024px)
- [ ] Test on viewport width 1280px
- [ ] Test on viewport width 1920px
- [ ] Test on viewport width 2560px
- [ ] Verify layout uses available space efficiently
- [ ] Verify charts are properly sized
- [ ] Verify no horizontal scrolling

## 3. Error Scenarios and Edge Cases

### 3.1 Network Errors
- [ ] Disconnect network
- [ ] Try to submit analysis
- [ ] Verify error message: "Unable to connect to server"
- [ ] Reconnect network
- [ ] Verify retry works

### 3.2 API Errors
- [ ] Test with invalid API endpoint
- [ ] Verify error message displays backend error
- [ ] Test with 401 Unauthorized
- [ ] Verify redirect to login page

### 3.3 Form Validation Edge Cases
- [ ] Test very long sequences (> 10,000 characters)
- [ ] Test sequences with whitespace
- [ ] Test sequences with mixed case
- [ ] Test copy-paste from different sources
- [ ] Test special characters in name field
- [ ] Test email with + symbol
- [ ] Test password with special characters

### 3.4 File Upload Edge Cases
- [ ] Test file with no extension
- [ ] Test file with multiple dots in name
- [ ] Test file with uppercase extension (.FASTA)
- [ ] Test empty file
- [ ] Test file exactly at 10MB limit

### 3.5 Session Management
- [ ] Login and wait for token expiration
- [ ] Try to perform action after expiration
- [ ] Verify redirect to login
- [ ] Login in one tab, logout in another
- [ ] Verify both tabs reflect logout state

## 4. Accessibility Testing

### 4.1 Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Verify focus indicators are visible
- [ ] Test form submission with Enter key
- [ ] Test Ctrl+Enter in textarea (should submit)
- [ ] Test Escape key to close modals/toasts
- [ ] Verify tab order is logical

### 4.2 Screen Reader Testing
- [ ] Test with VoiceOver (Mac) or NVDA (Windows)
- [ ] Verify all form labels are announced
- [ ] Verify error messages are announced
- [ ] Verify button purposes are clear
- [ ] Verify image alt text is present
- [ ] Verify ARIA labels are appropriate

### 4.3 Color Contrast
- [ ] Verify text meets WCAG 2.1 AA standards (4.5:1 ratio)
- [ ] Test with browser color contrast tools
- [ ] Verify error messages are distinguishable
- [ ] Verify focus states are visible

### 4.4 Visual Accessibility
- [ ] Test with browser zoom at 200%
- [ ] Verify layout doesn't break
- [ ] Verify text remains readable
- [ ] Test with high contrast mode
- [ ] Test with reduced motion preferences

## 5. Browser Compatibility

### 5.1 Chrome
- [ ] Test on latest version
- [ ] Verify all features work
- [ ] Check console for errors

### 5.2 Firefox
- [ ] Test on latest version
- [ ] Verify all features work
- [ ] Check console for errors

### 5.3 Safari
- [ ] Test on latest version
- [ ] Verify all features work
- [ ] Check console for errors

### 5.4 Edge
- [ ] Test on latest version
- [ ] Verify all features work
- [ ] Check console for errors

## 6. Performance Testing

- [ ] Measure page load time (should be < 3 seconds)
- [ ] Test with slow 3G network throttling
- [ ] Verify loading indicators appear appropriately
- [ ] Test with large sequences (> 5000 characters)
- [ ] Verify no memory leaks (check DevTools Memory tab)
- [ ] Test rapid tab switching
- [ ] Test rapid form submissions

## 7. Security Testing

- [ ] Verify JWT token is stored securely
- [ ] Verify sensitive data is not logged to console
- [ ] Test XSS prevention (enter `<script>alert('xss')</script>` in inputs)
- [ ] Verify HTTPS is enforced in production
- [ ] Test CORS headers
- [ ] Verify protected routes require authentication

## Test Results Summary

### Date: _______________
### Tester: _______________
### Environment: _______________

**Total Tests:** _______________
**Passed:** _______________
**Failed:** _______________
**Blocked:** _______________

### Critical Issues Found:
1. 
2. 
3. 

### Notes:


