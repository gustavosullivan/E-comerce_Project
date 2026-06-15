# Project Plan: Bugiganga E-commerce Platform Enhancements

This document outlines the planned improvements, refactoring, and new feature implementation for the Bugiganga Front-End application. The plan adheres to the architectural guidelines and best practices defined in `FrontEnd/Bugiganga/AGENTS.md`.

## I. Refactoring and Improvements

### 1. Unification of Store Structure

**Current Issue:** Inconsistency and duplication between `src/store/` and `src/stores/` directories.
**Objective:** Consolidate all store-related files into a single, unified `src/store/` directory for better organization and maintainability.
**Steps:**
    a. Identify all files within `src/stores/`.
    b. Move these files to `src/store/`.
    c. Update all import paths referencing `src/stores/` to `src/store/` throughout the codebase.
    d. Remove the now empty `src/stores/` directory.

### 2. Removal of Duplicate Register Screen

**Current Issue:** Duplicate `RegisterScreen.tsx` files (`src/screens/RegisterScreen.tsx` and `src/screens/Auth/RegisterScreen.tsx`), with Expo Router using the `Auth/` version.
**Objective:** Remove the unused duplicate file to eliminate redundancy and potential confusion.
**Steps:**
    a. Confirm that `src/screens/RegisterScreen.tsx` is indeed unused by the Expo Router.
    b. Delete `src/screens/RegisterScreen.tsx`.

### 3. Robust Authentication Check in `app/index.tsx`

**Current Issue:** `app/index.tsx` always redirects to `/login`, requiring logged-in users to pass through the login screen unnecessarily.
**Objective:** Implement an authentication check at the root level (`app/index.tsx`) to redirect authenticated users directly to the home screen (`/(tabs)`), enhancing User Experience (UX).
**Steps:**
    a. Utilize the `useAuth` hook (or similar authentication state mechanism) to check the user's authentication status.
    b. If the user is authenticated, programmatically navigate them to `/(tabs)`.
    c. If not authenticated, allow the existing redirect to `/login` or navigate explicitly to `/login`.
    d. Implement appropriate loading states to prevent flickering during the authentication check.

### 4. Logout Confirmation

**Current Issue:** No confirmation prompt before logging out, leading to potential accidental logouts.
**Objective:** Enhance UX by adding an `Alert.alert` confirmation dialog when the "Sair da conta" (Logout) option is selected.
**Steps:**
    a. Locate the component responsible for handling the "Sair da conta" action (likely in `src/screens/Profile/` or `app/(tabs)/profile.tsx`).
    b. Integrate `Alert.alert` to prompt the user for confirmation before executing the logout logic.

## II. New Feature: Admin UI Implementation

This section details the implementation of a specialized user interface for users with the 'ADMIN' role. This UI will provide administrative functionalities for product management and sales overview.

### 1. Role Nomenclature Alignment

**Decision:** The 'SELLER' role will be renamed to 'ADMIN' across the application to align with academic rigor.
**Steps:**
    a. Identify all instances of 'SELLER' (variables, types, strings) in the codebase.
    b. Rename these instances to 'ADMIN'. This includes updating any authentication or authorization logic that relies on this role name.

### 2. Dynamic Tab Navigation for ADMIN Role

**Objective:** When an ADMIN user logs in, the "Favorites" and "Cart" tabs in the main navigation (`/(tabs)`) should be dynamically replaced with "Novo" (New Product) and "Vendas" (Sales Dashboard) tabs.
**Steps:**
    a. Modify the `_layout.tsx` file within `app/(tabs)/` to dynamically render tabs based on the user's role obtained from the authentication context.
    b. Create new tab configurations for "Novo" and "Vendas".
    c. Ensure proper icon and label rendering for the new tabs.

### 3. "Novo" (New Product) Tab Implementation

**Objective:** Create a screen for ADMIN users to register new products.
**Screen Details:**
    *   **Title:** "Cadastrar Produto".
    *   **Location:** `app/admin/products/new.tsx` (or similar, accessible via the "Novo" tab).
    *   **Functionality:**
        *   Input fields for product details (name, description, price, stock, image, category).
        *   Utilize `React Hook Form` and `Zod` for form validation, adhering to `src/schemas/productSchema.ts` (if it exists, otherwise create one).
        *   Image upload functionality (placeholder initially, respecting `AGENTS.md` for future API integration).
        *   "Cadastrar Produto" button to submit the form.
    *   **Integration:**
        *   Develop a new service function in `src/services/productService.ts` (e.g., `createProduct`) that handles API calls for product creation.
        *   Initially, this service function will use mocks as per `AGENTS.md`.
        *   Implement loading and error states.

### 4. "Vendas" (Sales Dashboard) Tab Implementation

**Objective:** Create a screen that displays sales information and product management for the ADMIN user.
**Screen Details:**
    *   **Title:** "Painel do Vendedor".
    *   **Location:** `app/admin/dashboard.tsx` (or similar, accessible via the "Vendas" tab).
    *   **Content:**
        *   **Total Sales Value:** Display at the top, showing the sum of all sales made by the current ADMIN.
        *   **Product List:**
            *   List all products registered by the current ADMIN.
            *   Display product name, current stock quantity.
            *   Search bar to filter products.
            *   Action buttons: "Editar" (Edit) and "Excluir" (Delete) for each product.
            *   "Editar" should navigate to an edit product screen (`app/admin/products/[id].tsx`).
            *   "Excluir" should trigger a confirmation dialog before deleting.
    *   **Integration:**
        *   Develop new service functions in `src/services/productService.ts` (e.g., `getAdminProducts`, `updateProduct`, `deleteProduct`) and `src/services/orderService.ts` (e.g., `getAdminSalesSummary`).
        *   Initially, these service functions will use mocks.
        *   Implement loading and error states.

### 5. Product Management on Initial Screen for ADMIN

**Objective:** The default home screen for an ADMIN user should list their products with management options.
**Changes:**
    *   **Header Button:** Replace the "Carrinho" (Cart) button in the top right with an "Adicionar Produto" (Add Product) button. This button will navigate to the "Novo" (New Product) screen.
    *   **Product Listing:** The main content area should display a list of products belonging to the logged-in ADMIN, similar to the "Vendas" tab's product list, including stock quantity.
    *   **Search and Actions:** Include a search bar and "Editar"/"Excluir" options for each product, as described in section II.4.

### 6. Adherence to `AGENTS.md` Guidelines

Throughout the implementation, the following principles from `AGENTS.md` will be strictly followed:
    *   **Decoupled Front-End:** Maintain a clear separation between UI and business logic.
    *   **TypeScript:** Utilize TypeScript for all new components, services, and types.
    *   **Service Layer (`src/services/`):** All external communications (API calls) will be encapsulated within service files, even when using mocks.
    *   **Mocking:** Use realistic mocks for API responses until the backend is integrated.
    *   **API Contracts:** Define TypeScript interfaces for any new API data structures (e.g., `AdminProduct`, `SalesSummary`).
    *   **Reusability:** Design components to be reusable.
    *   **Error and Loading States:** Implement robust handling for loading and error states.
    *   **Quality:** Strive for high-quality, scalable, readable, and maintainable code.

## III. Next Steps

Upon approval of this plan, the implementation will proceed with the refactoring tasks first, followed by the development of the new Admin UI features. Each step will involve development, testing (initially with mocks), and validation.