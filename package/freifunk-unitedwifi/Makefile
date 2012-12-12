include $(TOPDIR)/rules.mk

PKG_NAME:=freifunk-unitedwifi
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

PKG_BUILD_DIR:=$(BUILD_DIR)/freifunk

include $(INCLUDE_DIR)/package.mk

define Package/freifunk-unitedwifi-basic
  SECTION:=base
  CATEGORY:=Config
  DEFAULT:=y
  TITLE:= Freifunk-Unitedwifi Basic
  URL:=http://www.unitedwifi.nl
  DEPENDS:=+kmod-batman-adv +nodogsplash +n2n2 +tinc +uhttpd +haserl +@BUSYBOX_CONFIG_TUNCTL +uhttpd-mod-tls +libcyassl +px5g
endef

define Build/Prepare
  echo "all: " > $(PKG_BUILD_DIR)/Makefile
endef

define Package/freifunk-unitedwifi-basic/install
  #nothing to do here
endef

define Package/freifunk-unitedwifi-basic-ath9k
  SECTION:=base
  CATEGORY:=Config
  DEFAULT:=n
  TITLE:=Freifunk-Unitedwifi Basic Ath9k
  URL:=http://www.unitedwifi.nl
  DEPENDS:= +freifunk-unitedwifi-basic +hostapd +kmod-ath9k
endef

define Package/freifunk-unitedwifi-OpenRD-max
  SECTION:=base
  CATEGORY:=Config
  DEFAULT:=n
  TITLE:=Freifunk-Unitedwifi OpenRD-Base max-features (without Basic)
  DEPENDS:= +nano +htop
endef

$(eval $(call BuildPackage,freifunk-unitedwifi-basic))
$(eval $(call BuildPackage,freifunk-unitedwifi-basic-ath9k))
$(eval $(call BuildPackage,freifunk-unitedwifi-OpenRD-max))
