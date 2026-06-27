ALTER TABLE tb_user
    ADD COLUMN IF NOT EXISTS buyer_profile boolean NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS seller_profile boolean NOT NULL DEFAULT true;

UPDATE tb_user
SET buyer_profile = true,
    seller_profile = true
WHERE buyer_profile IS DISTINCT FROM true
   OR seller_profile IS DISTINCT FROM true;
