DROP DATABASE IF EXISTS distribuidora;
CREATE DATABASE distribuidora CHARACTER SET utf8mb4;
USE distribuidora;

-- ============================================
-- 1. PROVEEDORES
-- ============================================
CREATE TABLE proveedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cuit VARCHAR(20) NOT NULL UNIQUE,
  telefono VARCHAR(30),
  email VARCHAR(100) UNIQUE,
  direccion VARCHAR(200),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================
-- 2. CATEGORIAS
-- ============================================
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  descripcion VARCHAR(200)
);

-- ============================================
-- 3. PRODUCTOS
-- ============================================
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  id_categoria INT,
  id_proveedor INT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id),
  FOREIGN KEY (id_proveedor) REFERENCES proveedores(id)
);

-- ============================================
-- 4. CLIENTES
-- ============================================
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cuit VARCHAR(20) UNIQUE,
  telefono VARCHAR(30),
  email VARCHAR(100) UNIQUE,
  direccion VARCHAR(200),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================
-- 5. EMPLEADOS
-- ============================================
CREATE TABLE empleados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  puesto VARCHAR(60) NOT NULL,
  salario DECIMAL(10,2) NOT NULL CHECK (salario >= 0),
  fecha_ingreso DATE NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================
-- 6. COMPANIAS DE ENVIOS
-- ============================================
CREATE TABLE companias_envios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(30),
  costo_base DECIMAL(10,2) NOT NULL CHECK (costo_base >= 0)
);

-- ============================================
-- 7. PEDIDOS
-- ============================================
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  id_cliente INT NOT NULL,
  id_empleado INT NOT NULL,
  estado ENUM('pendiente','en preparacion','en camino','entregado','cancelado')
         NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (id_cliente) REFERENCES clientes(id),
  FOREIGN KEY (id_empleado) REFERENCES empleados(id)
);

-- ============================================
-- 8. DETALLE DE PEDIDO
-- ============================================
CREATE TABLE detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
  UNIQUE KEY uk_pedido_producto (id_pedido, id_producto),
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- ============================================
-- 9. FACTURAS (1 pedido -> 1 factura)
-- ============================================
CREATE TABLE facturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(30) NOT NULL UNIQUE,
  fecha DATE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  iva DECIMAL(10,2) NOT NULL CHECK (iva >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  id_pedido INT NOT NULL UNIQUE,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id)
);

-- ============================================
-- 10. ENVIOS (1 pedido -> 1 envio)
-- ============================================
CREATE TABLE envios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL UNIQUE,
  id_compania INT NOT NULL,
  direccion VARCHAR(200) NOT NULL,
  fecha_envio DATE,
  estado ENUM('preparando','en camino','entregado','cancelado')
         NOT NULL DEFAULT 'preparando',
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
  FOREIGN KEY (id_compania) REFERENCES companias_envios(id)
);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

INSERT INTO proveedores (nombre, cuit, telefono, email, direccion) VALUES
('Coca-Cola FEMSA', '30-12345678-1', '1145551111', 'ventas@coca.com', 'Av. Rivadavia 1000'),
('Arcor S.A.', '30-87654321-2', '1145552222', 'contacto@arcor.com', 'Ruta 9 Km 50'),
('Molinos Río de la Plata', '30-11111111-3', '1145553333', 'info@molinos.com', 'Av. Belgrano 2000');

INSERT INTO categorias (nombre, descripcion) VALUES
('Bebidas', 'Gaseosas, aguas y jugos'),
('Snacks', 'Galletitas y alfajores'),
('Almacén', 'Aceites, harinas y pastas');

INSERT INTO productos (nombre, precio, stock, id_categoria, id_proveedor) VALUES
('Coca-Cola 2.25L', 3500.00, 100, 1, 1),
('Agua Mineral 500ml', 1200.00, 200, 1, 1),
('Alfajor Triple', 900.00, 150, 2, 2),
('Galletitas Oreo', 1500.00, 80, 2, 2),
('Aceite Girasol 1.5L', 4200.00, 60, 3, 3),
('Harina 000 1kg', 1300.00, 90, 3, 3);

INSERT INTO clientes (nombre, cuit, telefono, email, direccion) VALUES
('Supermercado El Sol', '20-11111111-1', '1144441111', 'compras@elsol.com', 'Av. Corrientes 500'),
('Almacén Doña Rosa', '27-22222222-2', '1144442222', 'rosa@almacen.com', 'Calle Falsa 123');

INSERT INTO empleados (nombre, apellido, puesto, salario, fecha_ingreso) VALUES
('Juan', 'Pérez', 'Vendedor', 850000.00, '2023-03-01'),
('Ana', 'Gómez', 'Administrativa', 900000.00, '2022-08-15');

INSERT INTO companias_envios (nombre, telefono, costo_base) VALUES
('Andreani', '0800-333-3333', 2500.00),
('Correo Argentino', '0800-777-7777', 1800.00);

INSERT INTO pedidos (fecha, id_cliente, id_empleado, estado) VALUES
('2025-06-01', 1, 1, 'entregado'),
('2025-06-05', 2, 2, 'en camino');

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 10, 3500.00),
(1, 3, 20, 900.00),
(2, 5, 5, 4200.00);

INSERT INTO facturas (numero, fecha, subtotal, iva, total, id_pedido) VALUES
('A-0001-00000001', '2025-06-01', 53000.00, 11130.00, 64130.00, 1);

INSERT INTO envios (id_pedido, id_compania, direccion, fecha_envio, estado) VALUES
(1, 1, 'Av. Corrientes 500', '2025-06-02', 'entregado'),
(2, 2, 'Calle Falsa 123', '2025-06-06', 'en camino');