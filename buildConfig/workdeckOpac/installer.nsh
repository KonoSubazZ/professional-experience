!macro preInit
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BlueWhale\opac"
    WriteRegExpandStr HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BlueWhale\opac"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BlueWhale\opac"
    WriteRegExpandStr HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BlueWhale\opac"
!macroend